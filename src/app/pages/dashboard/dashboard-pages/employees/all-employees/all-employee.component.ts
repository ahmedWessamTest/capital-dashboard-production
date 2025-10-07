import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../../../../core/services/users/users.service';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { User } from '../../motors-requests/services/motors-requests.service';
import { NormalizeActiveStatusService } from '../../../../../core/normalize-active-status/normalize-active-status.service';

interface FilterOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-all-employees',
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
  template: `
    <p-toast></p-toast>

    @if (isLoading()) {
            <app-loading-data-banner></app-loading-data-banner>

    } @else {
      <div class="card">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-semibold">Employees Control</h2>
          <p-button 
            routerLink="/dashboard/menu/add-employee" 
            label="Add Employee" 
            icon="pi pi-plus" 
            class="btn-main text-white">
          </p-button>
        </div>

        <div class="mb-3 flex justify-content-end">
          <span class="p-input-icon-right">
            <i class="pi pi-search"></i>
            <input 
              #search 
              class="mb-0" 
              type="text" 
              pInputText 
              placeholder="Search Employees..." 
              (input)="onGlobalFilter($event)" />
          </span>
        </div>

        <p-table 
          #dt 
          [paginator]="true" 
          [rows]="rowsPerPage" 
          [totalRecords]="totalRecords" 
          [rowsPerPageOptions]="getPagination()" 
          [showCurrentPageReport]="true" 
          [value]="filteredEmployees" 
          responsiveLayout="scroll"
          (onSort)="onSort($event)">
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id" class="text-center">
                ID <p-sortIcon field="id"></p-sortIcon>
              </th>
              <th class="text-center" pSortableColumn="name">
              Name
              </th>
              <th class="text-center" pSortableColumn="email">
            Email
              </th>
              <!-- <th class="text-center">
                <p-dropdown 
                  [options]="roleOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  [(ngModel)]="activeFilters['role']" 
                  (onChange)="onFilterChange('role', $event.value)"
                  placeholder="Role" 
                  [showClear]="true" 
                  [autoZIndex]="true">
                </p-dropdown>
              </th> -->
              <th class="text-center">
                <p-dropdown 
                  [options]="statusOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  [(ngModel)]="activeFilters['is_active']" 
                  (onChange)="onFilterChange('is_active', $event.value)"
                  placeholder="Status" 
                  [showClear]="true" 
                  [autoZIndex]="true">
                </p-dropdown>
              </th>
              <th class="text-center">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-emp>
            <tr>
              <td class="text-center">{{ emp.id }}</td>
              <td class="text-center">{{ emp.name }}</td>
              <td class="text-center">{{ emp.email }}</td>
              <!-- <td class="text-center">{{ emp.role }}</td> -->
              <td class="text-center">
                <p-inputSwitch 
                  [ngModel]="emp.is_active"
                  (onChange)="toggleStatus(emp)">
                </p-inputSwitch>
              </td>
              <td class="text-center">
                <a [routerLink]="['/dashboard/menu/view-employee', emp.id]">
                <p-button 
                  icon="pi pi-eye" 
                
                  class="p-button-text">
                </p-button></a>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6">
                <app-no-data-found-banner></app-no-data-found-banner>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    }
  `,
  styles: "",
  providers: [MessageService],
})
export class AllEmployeesComponent {
  employees: any[] = [];
  filteredEmployees: User[] = [];
  nameOptions: FilterOption[] = [];
  emailOptions: FilterOption[] = [];
  roleOptions: FilterOption[] = [];
  isLoading = signal<boolean>(false)
  statusOptions: FilterOption[] = [
    { label: 'Active', value: 1 },
    { label: 'Deleted', value: 0 },
  ];
  activeFilters: Record<string, string | number | null> = {
    name: null,
    email: null,
    role: null,
    is_active: null,
  };
  totalRecords = 0;
  rowsPerPage = 10;
  searchTerm = '';

  private userService = inject(UserService);
  private spinner = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private normalizeActiveStatusService = inject(NormalizeActiveStatusService);

  ngOnInit(): void {
    this.spinner.show('actionsLoader');
    this.isLoading.set(true);
    this.userService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.data.map(emp => ({
          ...emp,
          is_active: !this.normalizeActiveStatusService.normalizeActiveStatus(emp.delete_status)
        }));
        this.filteredEmployees = [...this.employees];
        this.totalRecords = this.employees.length;
        this.initFilterOptions();
        this.spinner.hide('actionsLoader');
        this.isLoading.set(false);
      },
      error: () => {
        this.showError('Failed to load employees');
        this.spinner.hide('actionsLoader');
        this.isLoading.set(false);
      },
    });
  }

  private initFilterOptions(): void {
    this.nameOptions = this.getDistinctOptions(this.employees, 'name');
    this.emailOptions = this.getDistinctOptions(this.employees, 'email');
    this.roleOptions = this.getDistinctOptions(this.employees, 'role');
  }

  private getDistinctOptions(data: any[], field: string): FilterOption[] {
    const uniqueValues = [...new Set(data.map((item) => item[field]))].filter((value) => value);
    return uniqueValues.map((value) => ({
      label: String(value),
      value,
    }));
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(
      (emp) =>
        this.matchesFilter(emp, 'name', this.activeFilters['name']) &&
        this.matchesFilter(emp, 'email', this.activeFilters['email']) &&
        this.matchesFilter(emp, 'role', this.activeFilters['role']) &&
        this.matchesFilter(emp, 'is_active', this.activeFilters['is_active']) &&
        this.matchesSearch(emp)
    );
    this.totalRecords = this.filteredEmployees.length;
  }

  private matchesFilter(emp: any, field: string, value: string | number | null): boolean {
    if (!value && value !== 0) return true; // Allow 0 as a valid filter value
    if (field === 'is_active') {
      return emp.is_active === (value === 1); // Convert filter value to boolean
    }
    return emp[field as keyof User]?.toString() === value.toString();
  }

  private matchesSearch(emp: any): boolean {
    if (!this.searchTerm) return true;
    const searchFields = [
      emp.id.toString(),
      emp.name,
      emp.email || '',
      emp.role,
      emp.is_active ? 'active' : 'deleted',
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

  toggleStatus(emp: any): void {
    this.spinner.show('actionsLoader');
    const newStatus = emp.is_active ? 1 : 0; // Inverse for API (0 = active, 1 = deleted)
    const action$ = newStatus ? this.userService.delete(emp.id) : this.userService.activate(emp.id);
    action$.subscribe({
      next: () => {
        emp.is_active = newStatus ? 0 : 1;
        this.applyFilters();
        this.showSuccess(`Employee ${emp.is_active ? 'activated' : 'deleted'} successfully`);
        this.spinner.hide('actionsLoader');
      },
      error: () => {
        this.showError('Failed to update employee status');
        this.spinner.hide('actionsLoader');
      },
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  getPagination(): number[] {
    const dataLength = this.filteredEmployees.length;
    return [10, 25, 50, 100,dataLength].filter(opt => opt <= dataLength);
  }

  onSort(event: { field: string; order: number }): void {
    this.filteredEmployees.sort((a, b) => {
      const valueA = a[event.field as keyof User];
      const valueB = b[event.field as keyof User];
      if (valueA == null) return 1;
      if (valueB == null) return -1;
      return (valueA < valueB ? -1 : 1) * (event.order === 1 ? 1 : -1);
    });
  }
}