import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendNotificationService } from '../service/send-notification.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-send-notification',
  standalone: true,
  imports: [NgxSpinnerComponent, LoadingDataBannerComponent, ReactiveFormsModule, ToastModule, ButtonModule],
  templateUrl: './send-notification.component.html',
  styleUrl: './send-notification.component.scss'
})
export class SendNotificationComponent implements OnInit, OnDestroy {
  sendNotificationUnSub!: Subscription;
  notificationForm!: FormGroup;
  isLoading = false;
  private readonly fb = inject(FormBuilder)
  private readonly SendNotificationService = inject(SendNotificationService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly messageService = inject(MessageService);
  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      titlemessage: ['', Validators.required],
      textmessage: ['', [Validators.required, Validators.minLength(10)]],
      artitlemessage: ['', Validators.required],
      artextmessage: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.notificationForm.invalid) return;

    this.isLoading = true;
    this.spinner.show('notificationSpinner');
    this.sendNotificationUnSub = this.SendNotificationService.sendNotification(this.notificationForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification sent!' });
        this.notificationForm.reset();
        this.spinner.hide('notificationSpinner');
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send notification' });
        this.spinner.hide('notificationSpinner');
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy(): void {
    this.sendNotificationUnSub?.unsubscribe();
  }
}
