import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MotorRequestsService, MotorRequest } from '../../services/motors-requests.service';
import { debounceTime, Subject } from 'rxjs';

interface StatusOption {
  label: string;
  value: string;
  icon: string;
  color: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-all-motors-requests',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    TableModule,
    ToastModule,
    RouterLink,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
    CommonModule,
    FormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './all-motors-requests.component.html',
  styleUrl: './all-motors-requests.component.scss',
  providers: [MessageService]
})
export class AllMotorsRequestsComponent {
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private motorRequestsService = inject(MotorRequestsService);
  private route = inject(ActivatedRoute);
  private cdRef = inject(ChangeDetectorRef);

  requests: MotorRequest[] = [];
  filteredRequests: MotorRequest[] = [];
  totalRecords: number = 0;
  rowsPerPage = 10;
  selectedStatus: string | null = null;
  selectedRequestType: string | null = null;
  requestTypeOptions: { label: string; value: string }[] = [];
  statusSteps = ['requested', 'pending', 'confirmed', 'canceled'];
  sortField: string | null = null;
  sortOrder: number = 1;
  currentPage: number = 1;
  selectOptions: StatusOption[] = [];
  isLoading = signal<boolean>(false);
  private searchSubject = new Subject<string>();
  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.initDropDownFilter();
    this.isLoading.set(true);
    this.requests = this.route.snapshot.data['data'].data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    this.isLoading.set(false);
    this.initRequestTypeOptions();
    this.applyFilters();
    this.ngxSpinnerService.hide('actionsLoader');
    this.setupSearchDebounce();
  }

  setupSearchDebounce() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(value => {
      this.applyGlobalFilter(value);
    });
  }

  initDropDownFilter(): void {
    this.selectOptions = [
      { label: 'Requested', value: 'requested', icon: 'pi pi-inbox', color: 'text-blue-600' },
      { label: 'Pending', value: 'pending', icon: 'pi pi-clock', color: 'text-yellow-600' },
      { label: 'Confirmed', value: 'confirmed', icon: 'pi pi-check-circle', color: 'text-green-600' },
      { label: 'Canceled', value: 'canceled', icon: 'pi pi-times-circle', color: 'text-red-600' }
    ];
  }

  initRequestTypeOptions(): void {
    const uniqueTypes = [...new Set(this.requests.map(request => request.request_type || 'individual'))];
    this.requestTypeOptions = uniqueTypes.map(type => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type
    }));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'bg-green-200 text-green-800';
      case 'canceled': return 'bg-red-200 text-red-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'requested': return 'bg-blue-200 text-blue-800';
      default: return '';
    }
  }

  getAvailableStatusOptions(currentStatus: string): StatusOption[] {
    const currentIndex = this.statusSteps.indexOf(currentStatus);
    return this.selectOptions
      .filter(option => currentStatus === 'confirmed' && option.value === 'canceled' ? false : true)
      .map((status, index) => ({
        ...status,
        disabled: index < currentIndex
      }));
  }

  applyFilters(): void {
    let filtered = [...this.requests];

    if (this.selectedStatus !== null) {
      filtered = filtered.filter(request => request.active_status === this.selectedStatus);
    }

    if (this.selectedRequestType !== null) {
      filtered = filtered.filter(request => (request.request_type || 'individual') === this.selectedRequestType);
    }

    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField, this.sortOrder));
    }

    this.filteredRequests = filtered;
    this.totalRecords = filtered.length;
    this.cdRef.detectChanges();
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim().toLowerCase();
    this.searchSubject.next(value);
  }

  applyGlobalFilter(value: string): void {
    let filtered = [...this.requests];

    if (this.selectedStatus !== null) {
      filtered = filtered.filter(request => request.active_status === this.selectedStatus);
    }

    if (this.selectedRequestType !== null) {
      filtered = filtered.filter(request => (request.request_type || 'individual') === this.selectedRequestType);
    }

    if (value) {
      filtered = filtered.filter(request => {
        return (
          (request.id?.toString().toLowerCase() || '').includes(value) ||
          (request.name?.toLowerCase() || '').includes(value) ||
          (request.email?.toLowerCase() || '').includes(value) ||
          (request.phone?.toString().toLowerCase() || '').includes(value) ||
          (request.active_status?.toLowerCase() || '').includes(value) ||
          (request.car_type?.toLowerCase() || '').includes(value) ||
          (request.car_brand?.toLowerCase() || '').includes(value) ||
          (request.car_model?.toLowerCase() || '').includes(value) ||
          (request.request_type?.toLowerCase() || '').includes(value)
        );
      });
    }

    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField, this.sortOrder));
    }

    this.filteredRequests = filtered;
    this.totalRecords = filtered.length;
    this.dt.first = 0; // Reset pagination to first page
    this.currentPage = 1;
    this.cdRef.detectChanges();
  }

  compareValues(a: MotorRequest, b: MotorRequest, field: string | null, order: number): number {
    if (!field) return 0;

    let valueA: any = a[field as keyof MotorRequest];
    let valueB: any = b[field as keyof MotorRequest];

    if (field === 'id' || field === 'phone') {
      valueA = valueA ? Number(valueA) : null;
      valueB = valueB ? Number(valueB) : null;
    } else if (field === 'created_at' || field === 'updated_at' || field === 'start_date' || field === 'end_date') {
      valueA = valueA ? new Date(valueA) : null;
      valueB = valueB ? new Date(valueB) : null;
    } else {
      valueA = valueA ? valueA.toString().toLowerCase() : '';
      valueB = valueB ? valueB.toString().toLowerCase() : '';
    }

    if (valueA === null || valueA === undefined || valueA === '') return order * -1;
    if (valueB === null || valueB === undefined || valueB === '') return order * 1;

    return valueA < valueB ? order * -1 : valueA > valueB ? order * 1 : 0;
  }

  onFilterChange(value: string | null): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onRequestTypeFilterChange(value: string | null): void {
    this.selectedRequestType = value;
    this.applyFilters();
  }

  onSort(event: { field: string | null; order: number }) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
  }

  updateRequestStatus(request: MotorRequest, status: 'confirmed' | 'canceled' | 'pending' | 'requested') {
    this.ngxSpinnerService.show('actionsLoader');

    const action$ = status === 'canceled'
      ? this.motorRequestsService.cancel(request.id)
      : this.motorRequestsService.changeStatus(request.id, status);

    action$.subscribe({
      next: (response) => {
        request.active_status = response.data.active_status;
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: response.message
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update request status'
        });
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  getPagination(): number[] {
    const dataLength = this.filteredRequests.length;
    return [10, 25, 50, 100, dataLength].filter(opt => opt <= dataLength);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }
  getStatusLabel(status: string): string {
  const option = this.selectOptions.find(opt => opt.value === status);
  return option ? option.label : status;
}

getStatusIcon(status: string): string {
  const option = this.selectOptions.find(opt => opt.value === status);
  return option ? option.icon : '';
}

getStatusColor(status: string): string {
  const option = this.selectOptions.find(opt => opt.value === status);
  return option ? option.color : '';
}
}