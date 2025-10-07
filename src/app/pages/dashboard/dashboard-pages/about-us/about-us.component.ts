import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { AboutUsService, IAboutUsData, IAboutUsUpdateResponse } from '../../../../core/services/n-about-us/about-us.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { ImageUploadComponent, ProductImage } from '../../../../shared/components/image-upload/image-upload.component';
import { IMAGE_BASE_URL } from '../../../../core/constants/WEB_SITE_BASE_UTL';
import { NgxJoditComponent } from "ngx-jodit";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    LoadingDataBannerComponent,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    NgxSpinnerModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    MessagesModule,
    ImageUploadComponent,
    NgxJoditComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  providers: [MessageService]
})
export class AboutUsComponent {
  private fb = inject(FormBuilder);
  private aboutUsService = inject(AboutUsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  aboutForm: FormGroup | null = null;
  originalData: IAboutUsData | null = null;
  isLoading = false;
  messages: Message[] = [];
  primaryImages: ProductImage[] = [];
  secondaryImages: ProductImage[] = [];
  primaryImageFiles: File[] = [];
  secondaryImageFiles: File[] = [];
  removedPrimaryImages: string[] = [];
  removedSecondaryImages: string[] = [];

  ngOnInit() {
    this.loadAboutUsInfo();
  }

  imageUrl = IMAGE_BASE_URL;

  private loadAboutUsInfo() {
    this.isLoading = true;
    this.ngxSpinnerService.show('actionsLoader');
    this.aboutUsService.getAboutUs().subscribe({
      next: (response: IAboutUsData) => {
        this.originalData = response;
        this.initializeForm(response.data);
        this.primaryImages = response.data.main_image ? [{
          id: 'primary-1',
          image: this.imageUrl + response.data.main_image,
          active_status: true,
          is_main: true
        }] : [];
        this.secondaryImages = response.data.history_image ? [{
          id: 'secondary-1',
          image: this.imageUrl + response.data.history_image,
          active_status: true,
          is_main: true
        }] : [];
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading = false;
      },
      error: () => {
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load About Us information'
        });
        this.messages = [{
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load About Us information'
        }];
      }
    });
  }

  private initializeForm(data: IAboutUsData['data']) {
    this.aboutForm = this.fb.group({
      en_main_title: [data.en_main_title, Validators.required],
      ar_main_title: [data.ar_main_title, Validators.required],
      en_main_content: [data.en_main_content, [Validators.required, Validators.minLength(5)]],
      ar_main_content: [data.ar_main_content, [Validators.required, Validators.minLength(5)]],
      en_mission: [data.en_mission, Validators.required],
      ar_mission: [data.ar_mission, Validators.required],
      en_vision: [data.en_vision, Validators.required],
      ar_vision: [data.ar_vision, Validators.required],
      en_history_title: [data.en_history_title, Validators.required],
      ar_history_title: [data.ar_history_title, Validators.required],
      en_history_text: [data.en_history_text, [Validators.required, Validators.minLength(5)]],
      ar_history_text: [data.ar_history_text, [Validators.required, Validators.minLength(5)]],
      en_meta_title: [data.en_meta_title, Validators.required],
      ar_meta_title: [data.ar_meta_title, Validators.required],
      en_meta_description: [data.en_meta_description, [Validators.required, Validators.minLength(5)]],
      ar_meta_description: [data.ar_meta_description, [Validators.required, Validators.minLength(5)]],
      en_about_first_feature_title: [data.en_about_first_feature_title || ''],
      ar_about_first_feature_title: [data.ar_about_first_feature_title || ''],
      en_about_first_feature_text: [data.en_about_first_feature_text || ''],
      ar_about_first_feature_text: [data.ar_about_first_feature_text || ''],
      en_about_second_feature_title: [data.en_about_second_feature_title || ''],
      ar_about_second_feature_title: [data.ar_about_second_feature_title || ''],
      en_about_second_feature_text: [data.en_about_second_feature_text || ''],
      ar_about_second_feature_text: [data.ar_about_second_feature_text || ''],
    });
  }

  onPrimaryImagesChanged(event: { added: File[], removed: string[] }) {
    this.primaryImageFiles = event.added;
    this.removedPrimaryImages = event.removed;
    this.aboutForm?.markAsDirty();
  }

  onSecondaryImagesChanged(event: { added: File[], removed: string[] }) {
    this.secondaryImageFiles = event.added;
    this.removedSecondaryImages = event.removed;
    this.aboutForm?.markAsDirty();
  }

  onSubmit() {
    if (!this.aboutForm?.dirty && !this.primaryImageFiles.length && !this.secondaryImageFiles.length && !this.removedPrimaryImages.length && !this.removedSecondaryImages.length) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No changes to save'
      });
      this.messages = [{
        severity: 'info',
        summary: 'Info',
        detail: 'No changes to save'
      }];
      return;
    }
    if (this.aboutForm?.valid) {
      this.isLoading = true;
      this.ngxSpinnerService.show('actionsLoader');
      const formData = new FormData();
      Object.keys(this.aboutForm.value).forEach(key => {
        formData.append(key, this.aboutForm!.value[key]);
      });

      if (this.primaryImageFiles.length) {
        formData.append('main_image', this.primaryImageFiles[0]);
      }
      if (this.secondaryImageFiles.length) {
        formData.append('history_image', this.secondaryImageFiles[0]);
      }

      if (this.removedPrimaryImages.length) {
        formData.append('removed_main_image', this.removedPrimaryImages[0]);
      }
      if (this.removedSecondaryImages.length) {
        formData.append('removed_history_image', this.removedSecondaryImages[0]);
      }

      this.aboutUsService.updateAboutUs(formData).subscribe({
        next: (response: IAboutUsUpdateResponse) => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message
          });
          this.messages = [{
            severity: 'success',
            summary: 'Success',
            detail: response.message
          }];
          this.aboutForm?.markAsPristine();
          this.primaryImageFiles = [];
          this.secondaryImageFiles = [];
          this.removedPrimaryImages = [];
          this.removedSecondaryImages = [];
          this.primaryImages = response.data.main_image ? [{
            id: 'primary-1',
            image: this.imageUrl + response.data.main_image,
            active_status: true,
            is_main: true
          }] : [];
          this.secondaryImages = response.data.history_image ? [{
            id: 'secondary-1',
            image: this.imageUrl + response.data.history_image,
            active_status: true,
            is_main: true
          }] : [];
        },
        error: () => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update About Us information'
          });
          this.messages = [{
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update About Us information'
          }];
        }
      });
    } else {
      this.aboutForm?.markAllAsTouched();
      const invalidFields = Object.keys(this.aboutForm?.controls || {})
        .filter(controlName => this.aboutForm?.get(controlName)?.invalid)
        .map(controlName => {
          const control = this.aboutForm?.get(controlName);
          if (control?.errors?.['required']) {
            return `${controlName.replace(/_/g, ' ')} is required`;
          }
          if (control?.errors?.['minlength']) {
            return `${controlName.replace(/_/g, ' ')} must be at least 5 characters`;
          }
          return `${controlName.replace(/_/g, ' ')} is invalid`;
        });

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Invalid fields: ${invalidFields.join(', ')}`
      });
      this.messages = [{
        severity: 'error',
        summary: 'Error',
        detail: `Invalid fields: ${invalidFields.join(', ')}`
      }];
    }
  }

  markAsTouched(controlName: string) {
    this.aboutForm?.get(controlName)?.markAsTouched();
  }
}