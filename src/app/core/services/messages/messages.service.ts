// src/app/core/services/notification/notification.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
// src/app/core/enums/severity.enum.ts
export enum Severity {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn'
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  // Basic toast methods
  showSuccess(message: string, title: string = 'Success'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showWarn(message: string, title: string = 'Warning'): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000
    });
  }

  // Advanced method with full customization
  showToast(options: {
    severity: Severity | string;
    summary: string;
    detail: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
  }): void {
    this.messageService.add({
      ...options,
      life: options.life || 3000
    });
  }

  // Clear all toasts
  clear(): void {
    this.messageService.clear();
  }
}