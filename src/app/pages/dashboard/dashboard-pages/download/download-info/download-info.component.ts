import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { AboutDownload, AboutDownloadResponse, AboutDownloadService, AboutDownloadUpdate } from '../service/download-info.service';

@Component({
  selector: 'app-download-info', // Updated selector
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
    MessagesModule
  ],
  templateUrl: './download-info.component.html', // Updated template URL
  styleUrls: ['./download-info.component.scss'], // Updated style URL
  providers: [MessageService]
})
export class DownloadInfoComponent { // Updated class name
  private fb = inject(FormBuilder);
  private aboutDownloadService = inject(AboutDownloadService); // Injected new service
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  downloadForm: FormGroup | null = null; // Changed form group name
  originalData: AboutDownload | null = null; // Changed original data type
  isLoading = false;
  messages: Message[] = [];

  ngOnInit() {
    this.loadAboutDownloadInfo();
  }

  private loadAboutDownloadInfo() {
    this.isLoading = true;
    this.ngxSpinnerService.show('actionsLoader'); // Changed spinner name
    this.aboutDownloadService.getAboutDownload().subscribe({
      next: (response: AboutDownloadResponse) => {
        this.originalData = response.data;
        this.initializeForm(response.data);
        this.ngxSpinnerService.hide('actionsLoader'); // Changed spinner name
        this.isLoading = false;
      },
      error: () => {
        this.ngxSpinnerService.hide('actionsLoader'); // Changed spinner name
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load download information'
        });
        this.messages = [
          { severity: 'error', summary: 'Error', detail: 'Failed to load download information' }
        ];
      }
    });
  }

  private initializeForm(data: AboutDownload) {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    this.downloadForm = this.fb.group({
      en_title: [data.en_title, Validators.required],
      ar_title: [data.ar_title, Validators.required],
      en_text: [data.en_text, Validators.required],
      ar_text: [data.ar_text, Validators.required],
      android_download_link: [data.android_download_link, [Validators.pattern(urlPattern)]],
      ios_download_link: [data.ios_download_link, [Validators.pattern(urlPattern)]],
      elwinsh_link: [data.elwinsh_link, [Validators.pattern(urlPattern)]],
      main_download_link: [data.main_download_link, [Validators.pattern(urlPattern)]],
    });
  }

  onSubmit() {
    if (!this.downloadForm?.dirty) {
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
    if (this.downloadForm?.valid) {
      this.isLoading = true;
      this.ngxSpinnerService.show('actionsLoader'); // Changed spinner name
      const formData: AboutDownloadUpdate = this.downloadForm.value;

      this.aboutDownloadService.updateAboutDownload(formData).subscribe({
        next: (response: { success: string, message: string, data: AboutDownload }) => {
          this.ngxSpinnerService.hide('actionsLoader'); // Changed spinner name
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message
          });
          this.messages = [
            { severity: 'success', summary: 'Success', detail: response.message }
          ];
          this.downloadForm?.markAsPristine();
        },
        error: () => {
          this.ngxSpinnerService.hide('actionsLoader'); // Changed spinner name
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update download information'
          });
          this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Failed to update download information' }
          ];
        }
      });
    } else {
      this.downloadForm?.markAllAsTouched();
      const invalidFields = Object.keys(this.downloadForm.controls)
        .filter(controlName => this.downloadForm?.get(controlName)?.invalid)
        .map(controlName => {
          const control = this.downloadForm?.get(controlName);
          if (control?.errors?.['required']) {
            return `${controlName.replace(/_/g, ' ')} is required`;
          }
          if (control?.errors?.['pattern']) {
            return `${controlName.replace(/_/g, ' ')} must be a valid URL`;
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
    this.downloadForm?.get(controlName)?.markAsTouched();
  }
}