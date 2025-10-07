import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';
import { NgxJoditComponent } from 'ngx-jodit';
import { BlogFormData, BlogsService } from './darna-blogs.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';

export interface ProductImage {
  id: string | number;
  product_id: number;
  image: string;
  thumb: string;
  medium: string;
  order_view: number;
  is_main: boolean;
  active_status: boolean;
  created_at: string;
  updated_at: string;
}

function restrictPastDates(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return { pastDate: true };
  }
  return null;
}

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    NgxSpinnerModule,
    RouterLink,
    CommonModule,
    InputSwitchModule,
    ImageUploadComponent,
    NgxJoditComponent
  ],
  templateUrl: './darna-blogs.component.html',
  styleUrl: './darna-blogs.component.scss',
  providers: []
})
export class DarnaBlogsComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private blogsService = inject(BlogsService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  blogForm!: FormGroup;
  isSubmitting: boolean = false;
  addedImages: File[] = [];
  minDate: string = new Date().toISOString().split('T')[0];
  message = { text: '', type: '' };

  ngOnInit() {
    this.ngxSpinnerService.show('actionsLoader');
    this.initializeForm();
    this.ngxSpinnerService.hide('actionsLoader');
  }

  initializeForm() {
    this.blogForm = this.fb.group({
      en_blog_title: ['', Validators.required],
      ar_blog_title: ['', Validators.required],
      en_blog_text: ['', Validators.required],
      ar_blog_text: ['', Validators.required],
      en_alt_image: ['', Validators.required],
      ar_alt_image: [''],
      en_slug: ['', Validators.required],
      ar_slug: ['', Validators.required],
      blog_date: ['', [Validators.required, restrictPastDates]],
      en_meta_title: ['', Validators.required],
      ar_meta_title: ['', Validators.required],
      en_meta_text: ['', Validators.required],
      ar_meta_text: ['', Validators.required],
      en_first_script_text: ['', Validators.required],
      ar_first_script_text: ['', Validators.required],
      en_second_script_text: ['', Validators.required],
      ar_second_script_text: ['', Validators.required],
      active_status: [true, Validators.required],
      main_image: [null, Validators.required]
    });
    this.blogForm.markAsPristine();
  }

  onImagesChanged(event: { added: File[] }) {
    this.addedImages = event.added;
    if (this.addedImages.length > 0) {
      this.blogForm.patchValue({ main_image: this.addedImages[0] });
    } else {
      this.blogForm.patchValue({ main_image: null });
    }
    this.blogForm.get('main_image')?.updateValueAndValidity();
  }

  onActiveStatusChange(event: any) {
    this.blogForm.patchValue({ active_status: event.checked ? true : false });
  }
  joditConfig = {
    toolbar: true,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'alignleft', 'aligncenter', 'alignright', 'alignjustify', '|',
      'ul', 'ol', 'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'undo', 'redo', '|',
      'cut', 'copy', 'paste', 'copyformat', '|',
      'hr', 'eraser', 'fullsize', 'print', 'selectall'
    ],
    buttonsMD: [
      'bold', 'italic', 'underline', '|',
      'alignleft', 'aligncenter', 'alignright', 'alignjustify', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize'
    ],
    buttonsSM: [
      'bold', 'italic', 'underline', '|',
      'alignleft', 'aligncenter', 'alignright', '|',
      'ul', 'ol'
    ],
    buttonsXS: [
      'bold', 'italic', '|',
      'alignleft', 'aligncenter', 'alignright'
    ],
    height: 400,
    disabled: false,
    placeholder: 'Enter policy description...',
    allowTabNavigation: true,
    defaultMode: '1',
    toolbarAdaptive: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    uploader: {
      insertImageAsBase64URI: true
    },
    style: {
      family: 'Arial, sans-serif',
      size: '12px'
    }
  };
  onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting = true;
    this.blogForm.disable();
    this.ngxSpinnerService.show('actionsLoader');
    this.message = { text: '', type: '' };

    const formData: BlogFormData = this.blogForm.value;
    formData.active_status = this.blogForm.value.active_status ? '1' : '0';

    this.blogsService.create(formData).subscribe({
      next: (response) => {
        this.message = { text: 'Blog Added Successfully', type: 'success' };
        this.blogForm.reset();
        this.blogForm.markAsPristine();
        this.addedImages = [];
        this.isSubmitting = false;
        this.blogForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.router.navigate(['/dashboard/menu/darna-blogs']);
          this.message = { text: '', type: '' };
        }, 1000);
      },
      error: (error: any) => {
        let errorMessage = error.error?.message || 'Failed to create blog';
        if (error.error?.errors) {
          const errorFields = Object.keys(error.error.errors);
         errorFields.forEach((field) => {
          this.blogForm.get(field)?.setErrors({
            serverError: error.error.errors[field]
          });
         });
        }
        this.message = { text: errorMessage, type: 'error' };
        this.isSubmitting = false;
        this.blogForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.message = { text: '', type: '' };
        }, 5000);
      }
    });
  }
}