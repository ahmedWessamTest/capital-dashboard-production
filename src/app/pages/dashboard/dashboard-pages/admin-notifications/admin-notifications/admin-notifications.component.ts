import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { SendNotificationService } from '../../send-notification/service/send-notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    NoDataFoundBannerComponent,
  ],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.scss',
})
export class AdminNotificationsComponent implements OnInit {
  private ngxSpinnerService = inject(NgxSpinnerService);
  private router = inject(Router);
  private sendNotificationService = inject(SendNotificationService);
  // نقرأ السيجنال مباشرة من السيرفيس
  adminNotifications = this.sendNotificationService.adminNotifications;

  totalRecords: number = 0;
  rowsPerPage = 10;

  @ViewChild('dt') dt: Table | undefined;

  ngOnInit() {-
    // مفيش داعي نجيب داتا هنا، السيرفيس بيعمل polling
    this.sendNotificationService.markAllAsSeen();
    this.totalRecords = this.adminNotifications().length;
    
  }

  formatDateTime(date: Date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  customSort(event: any) {
    const { field, order } = event;
    if (field === 'comment_date') {
      event.data.sort((a: any, b: any) => {
        const dateA = a.comment_date?.getTime?.() ?? 0;
        const dateB = b.comment_date?.getTime?.() ?? 0;
        return (dateA - dateB) * order;
      });
    } else if (field === 'user_name') {
      event.data.sort(
        (a: any, b: any) => a.user_name.localeCompare(b.user_name) * order
      );
    } else if (field === 'category_name') {
      event.data.sort(
        (a: any, b: any) => a.category_name.localeCompare(b.category_name) * order
      );
    } else if (field === 'req_type') {
      event.data.sort(
        (a: any, b: any) => a.req_type.localeCompare(b.req_type) * order
      );
    } else if (field === 'user_id') {
      event.data.sort((a: any, b: any) => (a.user_id - b.user_id) * order);
    } else if (field === 'req_id') {
      event.data.sort((a: any, b: any) => (a.req_id - b.req_id) * order);
    }
  }

  getPagination(): number[] {
    const dataLength = this.adminNotifications().length;
    return [10, 25, 50, 100, dataLength].filter((opt) => opt <= dataLength);
  }

  viewExpiryNotification(categoryId: number, id: number, reqType: 'claim' | 'policy'): void {
    if (categoryId === 1) {
      this.router.navigate([
        reqType === 'claim'
          ? '/dashboard/menu/medical-claims/comments'
          : '/dashboard/menu/medical-request/comments',
        id,
      ]);
    } else if (categoryId === 2) {
      this.router.navigate([
        reqType === 'claim'
          ? '/dashboard/menu/motor-claims/comments'
          : '/dashboard/menu/motor-requests/comments',
        id,
      ]);
    } else if (categoryId === 3) {
      this.router.navigate([
        reqType === 'claim'
          ? '/dashboard/menu/building-claims/comments'
          : '/dashboard/menu/building-request/comments',
        id,
      ]);
    } else if (categoryId === 5) {
      this.router.navigate([
        reqType === 'claim'
          ? '/dashboard/menu/jop-claims/comments'
          : '/dashboard/menu/jop-request/comments',
        id,
      ]);
    }
  }
  
  getCategoryLabel(category: string): string {
  const map: any = {
    job: 'professional',
    building: 'property'
  };
  return map[category] || category;
}
}
