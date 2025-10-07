import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { CarBrand } from '../../../car-brands/services/car-brands.service';
import { CarModel } from '../../../car-model/services/car-model.service';
import { CarType } from '../../../car-types/services/car-types.service';
import { CarYearsService } from '../../services/car-years.service';

interface CombinedCarData {
  id: number;
  year_date: string;
  car_model_id: number;
  car_model_title: string;
  car_brand_id: number;
  car_brand_title: string;
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
  selector: 'app-all-car-years',
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
  templateUrl: './all-car-years.component.html',
  styleUrls: ['./all-car-years.component.scss'],
  providers: [MessageService],
})
export class AllCarYearsComponent {
  // Data properties
  combinedData: CombinedCarData[] = [];
  filteredData: CombinedCarData[] = [];
  carTypes: CarType[] = [];
  carBrands: CarBrand[] = [];
  carModels: CarModel[] = [];

  // Filter options
  yearOptions: FilterOption[] = [];
  modelOptions: FilterOption[] = [];
  brandOptions: FilterOption[] = [];
  typeOptions: FilterOption[] = [];
  statusOptions: FilterOption[] = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  // Filter states
  activeFilters: Record<string, string | number | null> = {
    year: null,
    model: null,
    brand: null,
    type: null,
    status: null,
  };

  // Pagination properties
  totalRecords = 0;
  rowsPerPage = 10;
  currentPage = 1;
  searchTerm = '';
  first = 0;

  // Services
  private carYearsService = inject(CarYearsService);
  public normalizeActiveStatus = inject(NormalizeActiveStatusService);
  private spinner = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: any) => {
        console.log(data.data);
        this.combinedData = data.data.combinedData;
        this.carTypes = data.data.carTypes;
        this.carBrands = data.data.carBrands;
        this.carModels = data.data.carModels;
        this.filteredData = [...this.combinedData];
        this.totalRecords = this.combinedData.length;
        this.initFilterOptions();
        this.spinner.hide('actionsLoader');
      },
      error: () => {
        this.showError('Failed to load data');
        this.spinner.hide('actionsLoader');
      },
    });
  }

  private initFilterOptions(): void {
    this.yearOptions = this.getDistinctOptions(this.combinedData, 'year_date');
    this.modelOptions = this.carModels.map((model) => ({
      label: model.en_title,
      value: model.id,
    }));
    this.brandOptions = this.carBrands.map((brand) => ({
      label: brand.en_title,
      value: brand.id,
    }));
    this.typeOptions = this.carTypes.map((type) => ({
      label: type.en_title,
      value: type.id,
    }));
  }

  private getDistinctOptions(data: any[], field: string): FilterOption[] {
    const uniqueValues = [...new Set(data.map((item) => item[field]))];
    return uniqueValues.map((value) => ({
      label: String(value),
      value,
    }));
  }

  applyFilters(): void {
    this.filteredData = this.combinedData.filter(
      (item) =>
        this.matchesFilter(item, 'year_date', this.activeFilters['year']) &&
        this.matchesFilter(item, 'car_model_id', this.activeFilters['model']) &&
        this.matchesFilter(item, 'car_brand_id', this.activeFilters['brand']) &&
        this.matchesFilter(item, 'car_type_id', this.activeFilters['type']) &&
        this.matchesFilter(item, 'active_status', this.activeFilters['status']) &&
        this.matchesSearch(item)
    );

    this.totalRecords = this.filteredData.length;
    this.first = 0; // Reset to first page when filters change
    this.currentPage = 1;
  }

  private matchesFilter(item: CombinedCarData, field: string, value: string | number | null): boolean {
    if (!value) return true;
    return item[field as keyof CombinedCarData]?.toString() === value.toString();
  }

  private matchesSearch(item: CombinedCarData): boolean {
    if (!this.searchTerm) return true;

    const searchFields = [
      item.id.toString(),
      item.year_date,
      item.car_model_title,
      item.car_brand_title,
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

  // Enhanced pagination methods
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.rowsPerPage = event.rows;
    this.first = event.first;
    
    // You can add custom logic here when page changes
    console.log('Page changed to:', this.currentPage);
    console.log('Current page info:', this.getCurrentPageInfo());
  }

  getCurrentPageInfo(): string {
    const start = this.first + 1;
    const end = Math.min(this.first + this.rowsPerPage, this.totalRecords);
    return `${start}-${end} of ${this.totalRecords}`;
  }

  getPagination(): number[] {
    return [5, 10, 25, 50, 100];
  }

  // Method to programmatically go to first page
  goToFirstPage(): void {
    this.first = 0;
    this.currentPage = 1;
  }

  // Method to programmatically go to last page
  goToLastPage(): void {
    const lastPage = Math.ceil(this.totalRecords / this.rowsPerPage);
    this.first = (lastPage - 1) * this.rowsPerPage;
    this.currentPage = lastPage;
  }

  toggleStatus(item: CombinedCarData): void {
    this.spinner.show('actionsLoader');
    const newStatus = !this.normalizeActiveStatus.normalizeActiveStatus(item.active_status);
    const action$ = newStatus ? this.carYearsService.enable(item.id) : this.carYearsService.disable(item.id);

    action$.subscribe({
      next: () => {
        item.active_status = String(newStatus);
        this.applyFilters();
        this.showSuccess(`Car year ${newStatus ? 'enabled' : 'disabled'} successfully`);
        this.spinner.hide('actionsLoader');
      },
      error: () => {
        this.showError('Failed to update car year status');
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

  onSort(event: { field: string; order: number }): void {
    this.filteredData.sort((a, b) => {
      let valueA = a[event.field as keyof CombinedCarData];
      let valueB = b[event.field as keyof CombinedCarData];

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