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
import { ContactUsService, ContactUs, ContactUsResponse, ContactUsUpdate } from '../service/social-links.service';

@Component({
  selector: 'app-contact-us',
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
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
  providers: [MessageService]
})
export class SocialLinksComponent {
  private fb = inject(FormBuilder);
  private contactUsService = inject(ContactUsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  contactForm: FormGroup | null = null;
  originalData: ContactUs | null = null;
  isLoading = false;
  messages: Message[] = [];

  ngOnInit() {
    this.loadContactUsInfo();
  }

  private loadContactUsInfo() {
    this.isLoading = true;
    this.ngxSpinnerService.show('contactSpinner');
    this.contactUsService.getContactUs().subscribe({
      next: (response: ContactUsResponse) => {
        this.originalData = response.data;
        this.initializeForm(response.data);
        this.ngxSpinnerService.hide('contactSpinner');
        this.isLoading = false;
      },
      error: () => {
        this.ngxSpinnerService.hide('contactSpinner');
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contact information'
        });
        this.messages = [
          { severity: 'error', summary: 'Error', detail: 'Failed to load contact information' }
        ];
      }
    });
  }

  private initializeForm(data: ContactUs) {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    this.contactForm = this.fb.group({
      en_address: [data.en_address, Validators.required],
      ar_address: [data.ar_address, Validators.required],
      first_phone: [data.first_phone],
      second_phone: [data.second_phone],
      third_phone: [data.third_phone],
      fourth_phone: [data.fourth_phone],
      whatsapp: [data.whatsapp],
      email: [data.email, [Validators.required, Validators.email]],
      facebook: [data.facebook, [Validators.pattern(urlPattern)]],
      twitter: [data.twitter, [Validators.pattern(urlPattern)]],
      instagram: [data.instagram, [Validators.pattern(urlPattern)]],
      linkedin: [data.linkedin, [Validators.pattern(urlPattern)]],
      // youtube: [data.youtube, [Validators.pattern(urlPattern)]],
      // google_plus: [data.google_plus, [Validators.pattern(urlPattern)]],
      en_meta_title: [data.en_meta_title, Validators.required],
      ar_meta_title: [data.ar_meta_title, Validators.required],
      en_meta_description: [data.en_meta_description, [Validators.required]],
      ar_meta_description: [data.ar_meta_description, [Validators.required]],
      en_contact_title: [data.en_contact_title, Validators.required],
      ar_contact_title: [data.ar_contact_title, Validators.required],
      en_contact_text: [data.en_contact_text, [Validators.required]],
      ar_contact_text: [data.ar_contact_text, [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.contactForm?.dirty) {
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
    if (this.contactForm?.valid) {
      this.isLoading = true;
      this.ngxSpinnerService.show('contactSpinner');
      const formData: ContactUsUpdate = this.contactForm.value;

      this.contactUsService.updateContactUs(formData).subscribe({
        next: (response: { success: string ,message: string,data: ContactUs}) => {
          this.ngxSpinnerService.hide('contactSpinner');
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message
          });
          this.messages = [
            { severity: 'success', summary: 'Success', detail: response.message }
          ];
          this.contactForm?.markAsPristine();
        },
        error: () => {
          this.ngxSpinnerService.hide('contactSpinner');
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update contact information'
          });
          this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Failed to update contact information' }
          ];
        }
      });
    } else {
      this.contactForm?.markAllAsTouched();
      const invalidFields = Object.keys(this.contactForm.controls)
        .filter(controlName => this.contactForm?.get(controlName)?.invalid)
        .map(controlName => {
          const control = this.contactForm?.get(controlName);
          if (control?.errors?.['required']) {
            return `${controlName.replace(/_/g, ' ')} is required`;
          }
          if (control?.errors?.['email']) {
            return `${controlName.replace(/_/g, ' ')} must be a valid email`;
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
    this.contactForm?.get(controlName)?.markAsTouched();
  }
}