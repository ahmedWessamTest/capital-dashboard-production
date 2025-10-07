import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NgxJoditComponent } from 'ngx-jodit';
import { IPrivacyPolicyData, IPrivacyPolicyUpdateResponse, PrivacyPolicyService } from '../../../../core/services/o-privacy-policy/privacy-policy.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    LoadingDataBannerComponent,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    NgxSpinnerModule,
    ButtonModule,
    InputTextModule,
    MessagesModule,
    NgxJoditComponent
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  providers: [MessageService]
})
export class PrivacyPolicyComponent {
  private fb = inject(FormBuilder);
  private privacyPolicyService = inject(PrivacyPolicyService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  privacyForm: FormGroup | null = null;
  originalData: IPrivacyPolicyData | null = null;
  isLoading = false;
  messages: Message[] = [];

  ngOnInit() {
    this.loadPrivacyPolicyInfo();
  }

  private loadPrivacyPolicyInfo() {
    this.isLoading = true;
    this.ngxSpinnerService.show('actionsLoader');
    this.privacyPolicyService.getPrivacyPolicy().subscribe({
      next: (response: IPrivacyPolicyData) => {
        this.originalData = response;
        this.initializeForm(response.data);
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading = false;
      },
      error: () => {
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Privacy Policy information'
        });
        this.messages = [{
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Privacy Policy information'
        }];
      }
    });
  }

  private initializeForm(data: IPrivacyPolicyData['data']) {
    this.privacyForm = this.fb.group({
      en_title: [data.en_title || '', Validators.required],
      ar_title: [data.ar_title || '', Validators.required],
      en_description: [data.en_description || '', Validators.required],
      ar_description: [data.ar_description || '', Validators.required]
    });
  }

  onSubmit() {
    if (!this.privacyForm?.dirty) {
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
    if (this.privacyForm?.valid) {
      this.isLoading = true;
      this.ngxSpinnerService.show('actionsLoader');
      const formData = new FormData();
      Object.keys(this.privacyForm.value).forEach(key => {
        formData.append(key, this.privacyForm!.value[key]);
      });

      this.privacyPolicyService.updatePrivacyPolicy(formData).subscribe({
        next: (response: IPrivacyPolicyUpdateResponse) => {
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
          this.privacyForm?.markAsPristine();
        },
        error: () => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update Privacy Policy information'
          });
          this.messages = [{
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update Privacy Policy information'
          }];
        }
      });
    } else {
      this.privacyForm?.markAllAsTouched();
      const invalidFields = Object.keys(this.privacyForm?.controls || {})
        .filter(controlName => this.privacyForm?.get(controlName)?.invalid)
        .map(controlName => `${controlName.replace(/_/g, ' ')} is required`);

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
    this.privacyForm?.get(controlName)?.markAsTouched();
  }
}