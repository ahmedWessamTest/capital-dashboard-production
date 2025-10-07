import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {
  JobClaim,
  JobClaimsService,
} from '../../../../../../core/services/claims/jop-claim.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

interface StatusOption {
  label: string;
  value: string;
  icon: string;
  color: string;
  disabled?: boolean;
}

interface TypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-all-jop-claims',
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
    NgxSpinnerModule,
    CalendarModule,
  ],
  templateUrl: './all-jop-claims.component.html',
  styleUrl: './all-jop-claims.component.scss',
  providers: [MessageService],
})
export class AllJopClaimsComponent implements AfterViewInit {
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private jobClaimsService = inject(JobClaimsService);
  private route = inject(ActivatedRoute);

  claims: JobClaim[] = [];
  isLoading = signal<boolean>(false);
  filteredClaims: JobClaim[] = [];
  totalRecords: number = 0;
  rowsPerPage = 10;
  selectedStatus: string | null = null;
  selectedType: string | null = null;
  statusSteps = ['requested', 'pending', 'confirmed', 'canceled'];
  sortField: string | null = null;
  sortOrder: number = 1;
  currentPage: number = 1;
  selectOptions: StatusOption[] = [];
  typeOptions: TypeOption[] = [];
  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.initDropDownFilter();
    this.initTypeFilter();
    this.isLoading.set(true);
    console.log(this.route.snapshot.data['data']);
    this.isLoading.set(false);
    this.claims = this.route.snapshot.data['data']?.data || [];
    this.applyFilters();
    this.ngxSpinnerService.hide('actionsLoader');
  }

  ngAfterViewInit() {
    console.log('Table reference:', this.dt);
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: 'Requested',
        value: 'requested',
        icon: 'pi pi-inbox',
        color: 'text-blue-600',
      },
      {
        label: 'Pending',
        value: 'pending',
        icon: 'pi pi-clock',
        color: 'text-yellow-600',
      },
      {
        label: 'Confirmed',
        value: 'confirmed',
        icon: 'pi pi-check-circle',
        color: 'text-green-600',
      },
      {
        label: 'Canceled',
        value: 'canceled',
        icon: 'pi pi-times-circle',
        color: 'text-red-600',
      },
    ];
  }

  initTypeFilter(): void {
    this.typeOptions = [
      { label: 'Manual', value: 'manual' },
      { label: 'Ordinary', value: 'ordinary' },
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-200 text-green-800';
      case 'canceled':
        return 'bg-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'requested':
        return 'bg-blue-200 text-blue-800';
      default:
        return '';
    }
  }

  getClaimType(claim: JobClaim): string {
    return claim.jop_insurance_id ? 'Ordinary' : 'Manual';
  }

  getAvailableStatusOptions(currentStatus: string): StatusOption[] {
    const currentIndex = this.statusSteps.indexOf(currentStatus);
    return this.selectOptions
      .filter((option) => {
        // Hide "canceled" option if current status is "confirmed"
        if (currentStatus === 'confirmed' && option.value === 'canceled') {
          return false;
        }
        return true;
      })
      .map((status, index) => ({
        ...status,
        disabled: index < currentIndex,
      }));
  }

  applyFilters(): void {
    let filtered = [...this.claims];

    if (this.selectedStatus !== null) {
      filtered = filtered.filter(
        (claim) => claim.status === this.selectedStatus
      );
    }

    if (this.selectedType !== null) {
      filtered = filtered.filter((claim) =>
        this.selectedType === 'manual'
          ? claim.jop_insurance_id === null
          : claim.jop_insurance_id !== null
      );
    }

    if (this.sortField) {
      filtered.sort((a, b) =>
        this.compareValues(a, b, this.sortField, this.sortOrder)
      );
    }

    this.filteredClaims = filtered;
    this.totalRecords = filtered.length;
  }

  onGlobalFilter(dt: Table, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toLowerCase();
    let filtered = [...this.claims];

    if (this.selectedStatus !== null) {
      filtered = filtered.filter(
        (claim) => claim.status === this.selectedStatus
      );
    }

    if (this.selectedType !== null) {
      filtered = filtered.filter((claim) =>
        this.selectedType === 'manual'
          ? claim.jop_insurance_id === null
          : claim.jop_insurance_id !== null
      );
    }

    if (value) {
      filtered = filtered.filter(
        (claim) =>
          claim.id.toString().includes(value) ||
          claim.name.toLowerCase().includes(value) ||
          (claim.email && claim.email.toLowerCase().includes(value)) ||
          (claim.phone && claim.phone.includes(value)) ||
          claim.status.toLowerCase().includes(value) ||
          (claim.job_title && claim.job_title.toLowerCase().includes(value)) ||
          (claim.company_name &&
            claim.company_name.toLowerCase().includes(value)) ||
          this.getClaimType(claim).toLowerCase().includes(value)
      );
    }

    if (this.sortField) {
      filtered.sort((a, b) =>
        this.compareValues(a, b, this.sortField, this.sortOrder)
      );
    }

    this.filteredClaims = filtered;
    this.totalRecords = filtered.length;
  }

  compareValues(
    a: JobClaim,
    b: JobClaim,
    field: string | null,
    order: number
  ): number {
    if (!field) return 0;

    let valueA: any = a[field as keyof JobClaim];
    let valueB: any = b[field as keyof JobClaim];

    if (field === 'id') {
      valueA = Number(valueA);
      valueB = Number(valueB);
    } else if (field === 'created_at' || field === 'updated_at') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    } else if (field === 'type') {
      valueA = this.getClaimType(a);
      valueB = this.getClaimType(b);
    }

    if (valueA === null || valueA === undefined) return order * -1;
    if (valueB === null || valueB === undefined) return order * 1;

    return valueA < valueB ? order * -1 : valueA > valueB ? order * 1 : 0;
  }

  onFilterChange(value: string | null): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onTypeFilterChange(value: string | null): void {
    this.selectedType = value;
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

  updateClaimStatus(
    claim: JobClaim,
    status: 'confirmed' | 'canceled' | 'pending' | 'requested'
  ) {
    this.ngxSpinnerService.show('actionsLoader');

    const formData = new FormData();
    formData.append('status', status);

    this.jobClaimsService.update(claim.id, formData).subscribe({
      next: (response) => {
        claim.status = response.data.status;
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: response.message,
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update claim status',
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }

  getPagination(): number[] {
    const dataLength = this.filteredClaims.length;
    return [10, 25, 50, 100, dataLength].filter((opt) => opt <= dataLength);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}
