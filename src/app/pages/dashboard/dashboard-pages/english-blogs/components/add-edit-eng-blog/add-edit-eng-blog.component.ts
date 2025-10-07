import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from '../../../../../../shared/components/image-upload/image-upload.component';
import { NgxJoditComponent } from 'ngx-jodit';
import { NormalizeActiveStatusService } from './../../../../../../core/normalize-active-status/normalize-active-status.service';
import { EnglishBlogsService, EnglishBlogResponse, EnglishBlogFormData } from '../../service/english-blogs.service';
import { IMAGE_BASE_URL } from '../../../../../../core/constants/WEB_SITE_BASE_UTL';

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
  selector: 'app-add-english-blog',
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
  templateUrl: './add-edit-eng-blog.component.html',
  styleUrl: './add-edit-eng-blog.component.scss',
  providers: []
})
export class AddEnglishBlogComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private englishBlogsService = inject(EnglishBlogsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private route = inject(ActivatedRoute);

  blogForm!: FormGroup;
  isSubmitting: boolean = false;
  addedImages: File[] = [];
  removedImages: string[] = [];
  isEditMode: boolean = false;
  blogId: string | null = null;
  initialImages: ProductImage[] = [];
  private readonly IMAGE_BASE_URL = IMAGE_BASE_URL;
  minDate: string = new Date().toISOString().split('T')[0];
  message = { text: '', type: '' };

  constructor(private NormalizeActiveStatusService: NormalizeActiveStatusService) {}

  ngOnInit() {
    this.ngxSpinnerService.show('actionsLoader');
    this.initializeForm();
    this.checkMode();
  }

  initializeForm() {
    this.blogForm = this.fb.group({
      en_blog_title: ['', Validators.required],
      en_blog_text: ['', Validators.required],
      en_meta_title: ['', Validators.required],
      en_meta_text: ['', Validators.required],
      en_first_script_text: ['', Validators.required],
      en_second_script_text: ['', Validators.required],
      blog_date: ['', [Validators.required, restrictPastDates]],
      active_status: [true, Validators.required],
      main_image: [null, Validators.required]
    });
    this.blogForm.markAsPristine();
  }

  checkMode() {
    this.route.url.subscribe(segments => {
      this.isEditMode = segments.some(segment => segment.path.includes('edit'));
      if (this.isEditMode) {
        this.blogId = this.route.snapshot.paramMap.get('id');
        if (this.blogId) {
          this.loadBlogData();
        }
      } else {
        this.initialImages = [];
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  loadBlogData() {
    this.route.data.subscribe({
      next: (data) => {
        const response = data['data'] as EnglishBlogResponse;
        const blog = response.data;
        const currentTime = new Date().toISOString();
        this.initialImages = blog.main_image
          ? [{
              id: `temp-${Date.now()}`,
              product_id: 0,
              image: this.IMAGE_BASE_URL + blog.main_image,
              thumb: this.IMAGE_BASE_URL + blog.main_image,
              medium: this.IMAGE_BASE_URL + blog.main_image,
              order_view: 0,
              is_main: true,
              active_status: true,
              created_at: currentTime,
              updated_at: currentTime
            }]
          : [];
        this.blogForm.patchValue({
          en_blog_title: blog.en_blog_title,
          en_blog_text: blog.en_blog_text,
          en_meta_title: blog.en_meta_title,
          en_meta_text: blog.en_meta_text,
          en_first_script_text: blog.en_first_script_text,
          en_second_script_text: blog.en_second_script_text,
          blog_date: blog.blog_date,
          active_status: this.NormalizeActiveStatusService.normalizeActiveStatus(blog.active_status),
          main_image: blog.main_image
        });
        this.blogForm.get('blog_date')?.setValidators([Validators.required]);
        this.blogForm.get('blog_date')?.updateValueAndValidity();
        this.blogForm.get('main_image')?.clearValidators();
        this.blogForm.get('main_image')?.updateValueAndValidity();
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (error: any) => {
        this.message = { text: error.error?.message || 'Failed to load blog data', type: 'error' };
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.message = { text: '', type: '' };
        }, 5000);
      }
    });
  }

  onImagesChanged(event: { added: File[], removed: string[] }) {
    this.addedImages = event.added;
    this.removedImages = event.removed;
    if (this.addedImages.length > 0) {
      this.blogForm.patchValue({ main_image: this.addedImages[0] });
      this.blogForm.get('main_image')?.setValidators([Validators.required]);
    } else if (this.isEditMode && this.initialImages.length > 0 && this.removedImages.length === 0) {
      const filename = this.initialImages[0].image.replace(this.IMAGE_BASE_URL, '');
      this.blogForm.patchValue({ main_image: filename });
      this.blogForm.get('main_image')?.clearValidators();
    } else {
      this.blogForm.patchValue({ main_image: null });
      this.blogForm.get('main_image')?.setValidators([Validators.required]);
    }
    this.blogForm.get('main_image')?.updateValueAndValidity();
  }

  onActiveStatusChange(event: any) {
    this.blogForm.patchValue({ active_status: event.checked ? true : false });
  }

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

    const formData: EnglishBlogFormData = this.blogForm.value;
    formData.active_status = this.blogForm.value.active_status ? '1' : '0';
    const apiCall = this.isEditMode && this.blogId
      ? this.englishBlogsService.update(+this.blogId, formData)
      : this.englishBlogsService.create(formData);

    apiCall.subscribe({
      next: (response) => {
        this.message = { text: `Blog ${this.isEditMode ? 'Updated' : 'Added'} Successfully`, type: 'success' };
        this.blogForm.reset();
        this.blogForm.markAsPristine();
        this.addedImages = [];
        this.removedImages = [];
        this.initialImages = [];
        this.isSubmitting = false;
        this.blogForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.router.navigate(['/dashboard/menu/en-blogs']);
          this.message = { text: '', type: '' };
        }, 1000);
      },
      error: (error: any) => {
        let errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} blog`;
        if (error.error?.errors) {
          const errorFields = Object.keys(error.error.errors);
          if (errorFields.length > 0) {
            errorMessage = error.error.errors[errorFields[0]][0];
          }
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