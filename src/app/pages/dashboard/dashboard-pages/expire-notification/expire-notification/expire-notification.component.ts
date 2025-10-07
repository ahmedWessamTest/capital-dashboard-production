import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { Buildingjob,  Jopjob, Medicaljob, Motorjob, SendNotificationService } from '../../send-notification/service/send-notification.service';

type IExpiryCompo = Jopjob | Medicaljob | Buildingjob | Motorjob;
@Component({
  selector: 'app-expire-notification',
  standalone: true,
  imports: [ButtonModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,],
  templateUrl: './expire-notification.component.html',
  styleUrl: './expire-notification.component.scss'
})
export class ExpireNotificationComponent {
  expiryNotifications = signal<any[]>([]) ;
  isLoading = signal<boolean>(false);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private router = inject(Router);
  private sendNotificationService = inject(SendNotificationService);

  selectedCategory: number | null = null;
  selectedNeedCall: string | null = null;
  selectedLeadType: string | null = null;
  totalRecords: number = 0;
  rowsPerPage = 10;

  @ViewChild('dt') dt: Table | undefined;

  ngOnInit() {
    this.fetchData();
  }
getCategoryName(name: number): string {
  switch (name) {
    case 1:
      return 'medical';
    case 2:
      return 'motor';
    case 3:
      return 'building';
    case 5:
      return 'job';
    default:
      return ''; // أو ممكن ترجع 'unknown'
  }
}

  fetchData() {
    this.ngxSpinnerService.show('actionsLoader');
    this.isLoading.set(true);
    this.sendNotificationService.getExpireNotifications().subscribe({
      next: (res) => {
        this.expiryNotifications.set([
  ...(res.Buildingjobs ?? []),
  ...(res.Jopjobs ?? []),
  ...(res.Medicaljobs ?? []),
  ...(res.Motorjobs ?? [])
].map(item => ({
  ...item,
  end_date: this.parseDate(item.end_date),
  category: this.getCategoryName(item.category_id)
})));

this.totalRecords = this.expiryNotifications.length;
console.log(this.expiryNotifications());
this.isLoading.set(false);

      }
    })
  }
  private parseDate(dateStr: string): Date {
  if (!dateStr) return null as any;
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
customSort(event: any) {
  const { field, order } = event;
console.log(order);
console.log(field);

  if (field === "end_date") {
    event.data.sort((a: any, b: any) => {
      // لو التاريخ جاي كـ string "30-09-2025"
      const dateA = a.end_date?.getTime?.() ?? 0;
      const dateB = b.end_date?.getTime?.() ?? 0; let result = 0;
      if (dateA < dateB) result = -1;
      else if (dateA > dateB) result = 1;
      return event.order * result;
    });
  } else if (field === "name") {
    event.data.sort((a: any, b: any) => {
      return a.name.localeCompare(b.name) * order;
    });
  } else if (field === "category") {
    event.data.sort((a: any, b: any) => {
      return a.category.localeCompare(b.category) * order;
    });
  }else if (field === "user_id") {
    event.data.sort((a: any, b: any) => {
      return (a.user_id - b.user_id) * order;
    });
  }else if (field === "id") {
    event.data.sort((a: any, b: any) => {
      return (a.id - b.id) * order;
    });
  }
}


  getPagination(): number[] {
    const dataLength = this.expiryNotifications.length;
    return [10, 25, 50, 100, dataLength].filter((opt) => opt <= dataLength);
  }


  viewExpiryNotification(categoryId: number, id: number): void {
    if (categoryId === 1) {
      this.router.navigate(['/dashboard/menu/medical-requests/view-medical-request', id]);
    } else if (categoryId === 2) {
      this.router.navigate(['/dashboard/menu/motor-requests/view-motor-request', id]);
    } else if (categoryId === 3) {
      this.router.navigate(['/dashboard/menu/building-requests/view-building-request', id]);
    } else if (categoryId === 5) {
      this.router.navigate(['/dashboard/menu/jop-requests/view', id]);
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
