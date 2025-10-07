import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService, Message } from 'primeng/api';
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { ClaimInfoService, ClaimInfo, ClaimInfoResponse, ClaimInfoFormData } from '../../../../../core/services/claims-information/claim-information.service';
import { NgxJoditComponent } from "ngx-jodit";
import { ImageUploadComponent, ProductImage } from '../../../../../shared/components/image-upload/image-upload.component';
import { IMAGE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

@Component({
  selector: 'app-claim-info',
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
    NgxJoditComponent,
    ImageUploadComponent
  ],
  templateUrl: './claim-info.component.html',
  styleUrls: ['./claim-info.component.scss'],
  providers: [MessageService]
})
export class ClaimInfoComponent {
  private fb = inject(FormBuilder);
  private claimInfoService = inject(ClaimInfoService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  imageURL = IMAGE_BASE_URL;

  claimForm: FormGroup | null = null;
  originalData: ClaimInfo | null = null;
  isLoading = false;
  messages: Message[] = [];
  claimInfoId: number | null = null;
  initialImages: ProductImage[] = [];
  addedImage: File | null = null;

  ngOnInit() {
    this.loadClaimInfo();
  }

  private loadClaimInfo() {
    this.isLoading = true;
    this.ngxSpinnerService.show('claimSpinner');
    this.claimInfoService.getAll().subscribe({
      next: (response: ClaimInfoResponse) => {
        if (response.data) {
          this.originalData = response.data;
          this.claimInfoId = response.data.id;
          this.initialImages = [{
            id: response.data.id,
            image: this.imageURL + response.data.main_image,
            active_status: true,
            is_main: true
          }];
          this.initializeForm(response.data);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'No claim information found.'
          });
          this.messages = [
            { severity: 'warn', summary: 'Warning', detail: 'No claim information found.' }
          ];
          this.initializeForm({
            id: 0,
            en_main_title: '',
            ar_main_title: '',
            en_main_text: '',
            ar_main_text: '',
            main_image: '',
            en_second_title: '',
            ar_second_title: '',
            en_second_text: '',
            ar_second_text: '',
            en_meta_title: '',
            ar_meta_title: '',
            en_meta_text: '',
            ar_meta_text: '',
            created_at: '',
            updated_at: '',
            active_status: true
          });
        }
        this.ngxSpinnerService.hide('claimSpinner');
        this.isLoading = false;
      },
      error: () => {
        this.ngxSpinnerService.hide('claimSpinner');
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load claim information'
        });
        this.messages = [
          { severity: 'error', summary: 'Error', detail: 'Failed to load claim information' }
        ];
      }
    });
  }

  private initializeForm(data: ClaimInfo) {
    this.claimForm = this.fb.group({
      en_main_title: [data.en_main_title, Validators.required],
      ar_main_title: [data.ar_main_title, Validators.required],
      en_main_text: [data.en_main_text, Validators.required],
      ar_main_text: [data.ar_main_text, Validators.required],
      main_image: [data.main_image],
      en_second_title: [data.en_second_title, Validators.required],
      ar_second_title: [data.ar_second_title, Validators.required],
      en_second_text: [data.en_second_text, Validators.required],
      ar_second_text: [data.ar_second_text, Validators.required],
      en_meta_title: [data.en_meta_title, Validators.required],
      ar_meta_title: [data.ar_meta_title, Validators.required],
      en_meta_text: [data.en_meta_text, Validators.required],
      ar_meta_text: [data.ar_meta_text, Validators.required]
    });
  }

  onImagesChanged(event: { added: File[], removed: string[] }) {
    if (event.added.length > 0) {
      this.addedImage = event.added[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.claimForm?.patchValue({ main_image: reader.result as string });
        this.claimForm?.markAsDirty();
      };
      reader.readAsDataURL(this.addedImage);
    } else if (event.removed.length > 0) {
      this.addedImage = null;
      this.claimForm?.patchValue({ main_image: '' });
      this.claimForm?.markAsDirty();
    }
  }

  onSubmit() {
    if (!this.claimForm?.dirty) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No changes to save'
      });
      this.messages = [
        { severity: 'info', summary: 'Info', detail: 'No changes to save' }
      ];
      return;
    }
    if (this.claimForm?.valid) {
      if (this.claimInfoId === null) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot update: Claim information ID is missing.'
        });
        return;
      }

      this.isLoading = true;
      this.ngxSpinnerService.show('claimSpinner');
      const formData = new FormData();
      
      // Append text fields
      const textFields: (keyof ClaimInfoFormData)[] = [
        'en_main_title',
        'ar_main_title',
        'en_main_text',
        'ar_main_text',
        'en_second_title',
        'ar_second_title',
        'en_second_text',
        'ar_second_text',
        'en_meta_title',
        'ar_meta_title',
        'en_meta_text',
        'ar_meta_text'
      ];
      
      textFields.forEach(field => {
        const value = this.claimForm?.get(field)?.value;
        if (value !== undefined && value !== null) {
          formData.append(field, value);
        }
      });

      // Append image only if a new one was selected
      if (this.addedImage) {
        formData.append('main_image', this.addedImage);
      }

      this.claimInfoService.update(this.claimInfoId, formData).subscribe({
        next: (response: { success: boolean, message: string, data: ClaimInfo }) => {
          this.ngxSpinnerService.hide('claimSpinner');
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message
          });
          this.messages = [
            { severity: 'success', summary: 'Success', detail: response.message }
          ];
          this.addedImage = null; // Reset added image
          this.claimForm?.markAsPristine();
        },
        error: () => {
          this.ngxSpinnerService.hide('claimSpinner');
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update claim information'
          });
          this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Failed to update claim information' }
          ];
        }
      });
    } else {
      this.claimForm?.markAllAsTouched();
      const invalidFields = Object.keys(this.claimForm.controls)
        .filter(controlName => this.claimForm?.get(controlName)?.invalid)
        .map(controlName => {
          const control = this.claimForm?.get(controlName);
          if (control?.errors?.['required']) {
            return `${controlName.replace(/_/g, ' ')} is required`;
          }
          return `${controlName.replace(/_/g, ' ')} is invalid`;
        });

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Invalid fields: ${invalidFields.join(', ')}`
      });
      this.messages = [
        { severity: 'error', summary: 'Error', detail: `Invalid fields: ${invalidFields.join(', ')}` }
      ];
    }
  }

  markAsTouched(controlName: string) {
    this.claimForm?.get(controlName)?.markAsTouched();
  }
}