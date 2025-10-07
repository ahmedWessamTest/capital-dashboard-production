import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { CarType } from '../../../car-types/services/car-types.service';
import { CarBrandsService } from '../../services/car-brands.service';

interface CombinedCarBrandData {
  id: number;
  en_title: string;
  ar_title: string;
  car_type_id: number;
  car_type_title: string;
  active_status: string;
  created_at: string;
  updated_at: string;
}

interface FilterOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-all-car-brands',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    InputSwitchModule,
    TableModule,
    ToastModule,
    RouterLink,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
  ],
  templateUrl: './all-car-brands.component.html',
  styleUrls: ['./all-car-brands.component.scss'],
  providers: [MessageService],
})
export class AllCarBrandsComponent {
  combinedData: CombinedCarBrandData[] = [];
  filteredData: CombinedCarBrandData[] = [];
  carTypes: CarType[] = [];
  isLoading = signal<boolean>(false);
  typeOptions: FilterOption[] = [];
  statusOptions: FilterOption[] = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  activeFilters: Record<string, string | number | null> = {
    type: null,
    status: null,
  };

  totalRecords = 0;
  rowsPerPage = 10;
  currentPage = 1;
  searchTerm = '';

  private carBrandsService = inject(CarBrandsService);
  public normalizeActiveStatus = inject(NormalizeActiveStatusService);
  private spinner = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.route.data.subscribe({
      next: ({ data }) => {
        this.combinedData = data.combinedData;
        this.carTypes = data.carTypes;
        this.filteredData = [...this.combinedData];
        this.totalRecords = this.combinedData.length;
        this.initFilterOptions();
        this.spinner.hide();
        this.isLoading.set(false);
      },
      error: () => {
        this.showError('Failed to load data');
        this.spinner.hide();
        this.isLoading.set(false);
      },
    });
    this.spinner.hide('actionsLoader');

  }

  private initFilterOptions(): void {
    this.typeOptions = this.carTypes.map((type) => ({
      label: type.en_title,
      value: type.id,
    }));
  }

  applyFilters(): void {
    this.filteredData = this.combinedData.filter(
      (item) =>
        this.matchesFilter(item, 'car_type_id', this.activeFilters['type']) &&
        this.matchesFilter(item, 'active_status', this.activeFilters['status']) &&
        this.matchesSearch(item)
    );

    this.totalRecords = this.filteredData.length;
  }

  private matchesFilter(item: CombinedCarBrandData, field: string, value: string | number | null): boolean {
    if (!value) return true;
    return item[field as keyof CombinedCarBrandData]?.toString() === value.toString();
  }

  private matchesSearch(item: CombinedCarBrandData): boolean {
    if (!this.searchTerm) return true;

    const searchFields = [
      item.id.toString(),
      item.en_title,
      item.ar_title,
      item.car_type_title,
      this.normalizeActiveStatus.normalizeActiveStatus(item.active_status) ? 'active' : 'inactive',
    ];

    return searchFields.some((field) => field.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onGlobalFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onFilterChange(filterName: string, value: string | number | null): void {
    this.activeFilters[filterName] = value;
    this.applyFilters();
  }

  toggleStatus(item: CombinedCarBrandData): void {
    this.spinner.show('actionsLoader');
    const newStatus = !this.normalizeActiveStatus.normalizeActiveStatus(item.active_status);
    const action$ = newStatus ? this.carBrandsService.enable(item.id) : this.carBrandsService.disable(item.id);

    action$.subscribe({
      next: () => {
        item.active_status = String(newStatus);
        this.applyFilters();
        this.showSuccess(`Car brand ${newStatus ? 'enabled' : 'disabled'} successfully`);
        this.spinner.hide('actionsLoader');
      },
      error: () => {
        this.showError('Failed to update car brand status');
        this.spinner.hide('actionsLoader');
      },
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  getPagination(): number[] {
    return [10, 25, 50, 100];
  }

  onSort(event: { field: string; order: number }): void {
    this.filteredData.sort((a, b) => {
      let valueA = a[event.field as keyof CombinedCarBrandData];
      let valueB = b[event.field as keyof CombinedCarBrandData];

      if (event.field === 'active_status') {
        valueA = this.normalizeActiveStatus.normalizeActiveStatus(valueA) ? 'true' : 'false';
        valueB = this.normalizeActiveStatus.normalizeActiveStatus(valueB) ? 'true' : 'false';
      }

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      return (valueA < valueB ? -1 : 1) * (event.order === 1 ? 1 : -1);
    });
  }
}