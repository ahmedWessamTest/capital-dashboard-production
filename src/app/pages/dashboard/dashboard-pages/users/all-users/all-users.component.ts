import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

interface FilterOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-all-users',
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
          <h2 class="text-2xl font-semibold">Users Control</h2>
          <p-button 
            routerLink="/dashboard/menu/add-user" 
            label="Add User" 
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
              placeholder="Search users..." 
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
          [value]="filteredUsers" 
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

          <ng-template pTemplate="body" let-user>
            <tr>
              <td class="text-center">{{ user.id }}</td>
              <td class="text-center">{{ user.name }}</td>
              <td class="text-center">{{ user.email }}</td>
              <!-- <td class="text-center">{{ user.role }}</td> -->
              <td class="text-center">
                <p-inputSwitch 
                  [ngModel]="user.is_active"
                  (onChange)="toggleStatus(user)">
                </p-inputSwitch>
              </td>
              <td class="text-center">
                <a [routerLink]="['/dashboard/menu/view-user', user.id]">
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
  styleUrls: ['./all-users.component.scss'],
  providers: [MessageService],
})
export class AllUsersComponent implements OnDestroy, OnInit {
  users: any[] = [];
  private readonly destroy$ = new Subject<void>()
  filteredUsers: User[] = [];
  nameOptions: FilterOption[] = [];
  emailOptions: FilterOption[] = [];
  roleOptions: FilterOption[] = [];
  statusOptions: FilterOption[] = [
    { label: 'Active', value: 1 },
    { label: 'Deleted', value: 0 },
  ];
  isLoading = signal<boolean>(false);
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
    this.isLoading.set(true);
    this.spinner.show('actionsLoader');
    this.userService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.users = response.data.map(user => ({
          ...user,
          is_active: !this.normalizeActiveStatusService.normalizeActiveStatus(user.delete_status)
        }));
        this.filteredUsers = [...this.users];
        this.totalRecords = this.users.length;
        this.initFilterOptions();
        this.spinner.hide('actionsLoader');
        this.isLoading.set(false);
      },
      error: () => {
        this.showError('Failed to load users');
        this.spinner.hide('actionsLoader');
        this.isLoading.set(false);
      },
    });
  }

  private initFilterOptions(): void {
    this.nameOptions = this.getDistinctOptions(this.users, 'name');
    this.emailOptions = this.getDistinctOptions(this.users, 'email');
    this.roleOptions = this.getDistinctOptions(this.users, 'role');
  }

  private getDistinctOptions(data: any[], field: string): FilterOption[] {
    const uniqueValues = [...new Set(data.map((item) => item[field]))].filter((value) => value);
    return uniqueValues.map((value) => ({
      label: String(value),
      value,
    }));
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(
      (user) =>
        this.matchesFilter(user, 'name', this.activeFilters['name']) &&
        this.matchesFilter(user, 'email', this.activeFilters['email']) &&
        this.matchesFilter(user, 'role', this.activeFilters['role']) &&
        this.matchesFilter(user, 'is_active', this.activeFilters['is_active']) &&
        this.matchesSearch(user)
    );
    this.totalRecords = this.filteredUsers.length;
  }

  private matchesFilter(user: any, field: string, value: string | number | null): boolean {
    if (!value && value !== 0) return true; // Allow 0 as a valid filter value
    if (field === 'is_active') {
      return user.is_active === (value === 1); // Convert filter value to boolean
    }
    return user[field as keyof User]?.toString() === value.toString();
  }

  private matchesSearch(user: any): boolean {
    if (!this.searchTerm) return true;
    const searchFields = [
      user.id.toString(),
      user.name,
      user.email || '',
      user.role,
      user.is_active ? 'active' : 'deleted',
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

  toggleStatus(user: any): void {
    this.spinner.show('actionsLoader');
    const newStatus = user.is_active ? 1 : 0; // Inverse for API (0 = active, 1 = deleted)
    const action$ = newStatus ? this.userService.delete(user.id) : this.userService.activate(user.id);
    action$.subscribe({
      next: () => {
        user.is_active = newStatus ? 0 : 1;
        this.applyFilters();
        this.showSuccess(`User ${user.is_active ? 'activated' : 'deleted'} successfully`);
        this.spinner.hide('actionsLoader');
      },
      error: () => {
        this.showError('Failed to update user status');
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
    const dataLength = this.filteredUsers.length;
    return [10, 25, 50, 100,dataLength].filter(opt => opt <= dataLength);
  }

  onSort(event: { field: string; order: number }): void {
    this.filteredUsers.sort((a, b) => {
      const valueA = a[event.field as keyof User];
      const valueB = b[event.field as keyof User];
      if (valueA == null) return 1;
      if (valueB == null) return -1;
      return (valueA < valueB ? -1 : 1) * (event.order === 1 ? 1 : -1);
    });
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}