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
import { ImageUploadComponent } from '../../../../../shared/components/image-upload/image-upload.component';
import { ProjectsService, ProjectFormData } from '../darna-projects.service';

export interface ProjectImage {
  id: string | number;
  project_id: number;
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
  selector: 'app-add-project',
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
  templateUrl: './add-darna.component.html',
  styleUrl: './add-darna.component.scss',
  providers: []
})
export class AddDarnaComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  projectForm!: FormGroup;
  isSubmitting: boolean = false;
  addedImages: File[] = [];
  addedBannerImages: File[] = [];
  minDate: string = new Date().toISOString().split('T')[0];
  message = { text: '', type: '' };

  ngOnInit() {
    this.ngxSpinnerService.show('actionsLoader');
    this.initializeForm();
    this.ngxSpinnerService.hide('actionsLoader');
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      en_project_name: ['', Validators.required],
      ar_project_name: ['', Validators.required],
      en_project_title: ['', Validators.required],
      ar_project_title: ['', Validators.required],
      en_small_text: ['', Validators.required],
      ar_small_text: ['', Validators.required],
      en_project_description: ['', Validators.required],
      ar_project_description: ['', Validators.required],
      en_script_text: ['', Validators.required],
      ar_script_text: ['', Validators.required],
      en_meta_title: ['', Validators.required],
      ar_meta_title: ['', Validators.required],
      en_meta_description: ['', Validators.required],
      ar_meta_description: ['', Validators.required],
      en_title_form: ['', Validators.required],
      ar_title_form: ['', Validators.required],
      en_description_form: ['', Validators.required],
      ar_description_form: ['', Validators.required],
      en_form_first_input_info: ['', Validators.required],
      ar_form_first_input_info: ['', Validators.required],
      en_form_second_input_info: ['', Validators.required],
      ar_form_second_input_info: ['', Validators.required],
      main_file_link: ['', Validators.required],
      google_map_link: ['', Validators.required],
      en_alt_main_image: ['', Validators.required],
      ar_alt_main_image: ['', Validators.required],
      en_alt_banner_image: ['', Validators.required],
      ar_alt_banner_image: ['', Validators.required],
      en_slug: ['', Validators.required],
      ar_slug: ['', Validators.required],
      project_date: ['', [Validators.required, restrictPastDates]],
      active_status: [true, Validators.required],
      main_image: [null, Validators.required],
      banner_image: [null, Validators.required]
    });
    this.projectForm.markAsPristine();
  }

  onImagesChanged(event: { added: File[] }, type: 'main' | 'banner') {
    if (type === 'main') {
      this.addedImages = event.added;
      this.projectForm.patchValue({ main_image: this.addedImages[0] || null });
      this.projectForm.get('main_image')?.updateValueAndValidity();
    } else {
      this.addedBannerImages = event.added;
      this.projectForm.patchValue({ banner_image: this.addedBannerImages[0] || null });
      this.projectForm.get('banner_image')?.updateValueAndValidity();
    }
  }

  onActiveStatusChange(event: any) {
    this.projectForm.patchValue({ active_status: event.checked ? true : false });
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
    placeholder: 'Enter project description...',
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
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting = true;
    this.projectForm.disable();
    this.ngxSpinnerService.show('actionsLoader');
    this.message = { text: '', type: '' };

    const formData: ProjectFormData = this.projectForm.value;
    formData.active_status = this.projectForm.value.active_status ? '1' : '0';

    this.projectsService.create(formData).subscribe({
      next: (response) => {
        this.message = { text: 'Project Added Successfully', type: 'success' };
        this.projectForm.reset();
        this.projectForm.markAsPristine();
        this.addedImages = [];
        this.addedBannerImages = [];
        this.isSubmitting = false;
        this.projectForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.router.navigate(['/dashboard/menu/darna-projects']);
          this.message = { text: '', type: '' };
        }, 1000);
      },
      error: (error: any) => {
        let errorMessage = error.error?.message || 'Failed to create project';
        if (error.error?.errors) {
          const errorFields = Object.keys(error.error.errors);
          errorFields.forEach((field) => {
            this.projectForm.get(field)?.setErrors({
              serverError: error.error.errors[field]
            });
          });
        }
        this.message = { text: errorMessage, type: 'error' };
        this.isSubmitting = false;
        this.projectForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.message = { text: '', type: '' };
        }, 5000);
      }
    });
  }
}