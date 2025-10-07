import { Component, Input, ViewChild, ChangeDetectorRef, inject, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingDataBannerComponent } from '../loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../no-data-found-banner/no-data-found-banner.component';
import { GenericDataService, Column } from '../../service/genereic-table.service';
import { IMAGE_BASE_URL } from '../../../core/constants/WEB_SITE_BASE_UTL';
import { ImageLoaderDirective } from '../../../core/directives/image-loading.directive';
interface SelectOption {
  label: string;
  value: string; // Changed to string to match dropdown values
}

interface BaseEntity {
  id: number;
  active_status: boolean; // Final type after conversion
  [key: string]: any;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputSwitchModule,
    TableModule,
    ToastModule,
    RouterLink,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ImageLoaderDirective
    
    
  ],
  templateUrl: './generic-table.component.html',
  providers: [MessageService]
})
export class GenericTableComponent<T extends BaseEntity> implements OnChanges ,OnInit{
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private genericDataService = inject(GenericDataService);
  private cdRef = inject(ChangeDetectorRef);

  // Input properties
  @Input() data: T[] = [];
  @Input() columns: Column[] = [];
  @Input() entityType: string = '';
  @Input() title: string = 'Data Control';
  @Input() addRoute: string = '';
  @Input() addRoute2: string = '';
  @Input() editRoute: string = '';
  @Input() editRoute2: string = '';
  @Input() viewRoute: string = '';
  @Input() viewRoute2: string = '';
  @Input() choicesRoute: string = '';
  @Input() choicesRoute2: string = '';
  @Input() rowsPerPage: number = 10;
  @Input() categoryOptions: SelectOption[] = [];
  @Input() ToggelStatus: boolean = true;
  @Input() getData: boolean = false;
  @Input() needCall: boolean = false;
  
  // Filter and display properties
  filteredData: T[] = [];
  totalRecords: number = 0;
  isLoading: boolean = true;
  selectedStatus: string | null = null;
  selectedNeedCall: string | null = null;
  selectedCategory: string | null = null;
  
  // Dropdown options
  selectOptions: SelectOption[] = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' }
  ];
  
  needCallOptions: SelectOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  // Sorting and pagination
  sortField: string | null = null;
  sortOrder: number = 1;
  currentPage: number = 1;
  searchValue: string = '';
  
  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !this.getData) {
      this.applyFilters();
    }
  }

  fetchData() {
    this.isLoading = true;
    if (this.getData) {
      this.genericDataService.getAll<T>(this.entityType).subscribe({
        next: (response) => {
          this.data = response.data.map(item => ({
            ...item,
            active_status: this.normalizeActiveStatus(item.active_status)
          }));
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to load ${this.title.toLowerCase()}`
          });
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private normalizeActiveStatus(status: any): boolean {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string') return status === '1' || status.toLowerCase() === 'true';
    return status === 1;
  }

  applyFilters(): void {
    let filtered = [...this.data];
    
    // Category filter
    if (this.selectedCategory) {
      const categoryId = this.selectedCategory;
     if(this.entityType === 'build-countries'){
      filtered = filtered.filter(item => 
        item['build_type_id']?.toString() === categoryId || 
        (item['build_type'] && item['build_type']['id']?.toString() === categoryId)
      );
       
      }
      else{
        filtered = filtered.filter(item => 
          item['category_id']?.toString() === categoryId || 
          (item['category'] && item['category']['id']?.toString() === categoryId)
        );
      }
     
     
    }

    // Status filter
    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      const statusBoolean = this.selectedStatus === '1';
      filtered = filtered.filter(item => item.active_status === statusBoolean);
    }
    
    // Need Call filter
    if (this.selectedNeedCall !== null && this.selectedNeedCall !== '') {
      filtered = filtered.filter(item => {
        const itemValue = item['need_call'];
        const searchValue = this.selectedNeedCall?.toLowerCase();
        
        if (typeof itemValue === 'boolean') {
          return searchValue === 'yes' ? itemValue : !itemValue;
        }
        return itemValue?.toString().toLowerCase() === searchValue;
      });
    }
    
    // Search filter
    if (this.searchValue) {
      const searchTerm = this.searchValue.toLowerCase();
      filtered = filtered.filter(item => {
        const columnMatch = this.columns.some(col =>
          (item[col.field]?.toString().toLowerCase() || '').includes(searchTerm)
        );
        
        const categoryMatch = item['category'] && 
          (item['category']['en_title']?.toLowerCase().includes(searchTerm) ||
          item['category']['ar_title']?.toLowerCase().includes(searchTerm));
        
        return columnMatch || categoryMatch;
      });
    }
    
    // Sorting
    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField!, this.sortOrder));
    }
    
    this.filteredData = filtered;
    this.totalRecords = filtered.length;
    this.cdRef.detectChanges();
  }

  onGlobalFilter(dt: Table, event: any) {
    this.searchValue = event.target.value; 
    this.applyFilters(); 
  }

  onFilterChange(value: string | null): void {
    this.selectedStatus = value;
    this.applyFilters(); 
  }

  compareValues(a: T, b: T, field: string, order: number): number {
    let valueA = a[field];
    let valueB = b[field];
    if (field === 'id') {
      valueA = Number(valueA);
      valueB = Number(valueB);
    } else if (field.includes('date') || field === 'created_at' || field === 'updated_at') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    if (valueA === null || valueA === undefined) return order * -1;
    if (valueB === null || valueB === undefined) return order * 1;
    return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * order;
  }

  onSort(event: any) {
    const field = event.field;
    const order = event.order;
    this.filteredData.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      if (field === 'id') {
        valueA = Number(a.id);
        valueB = Number(b.id);
      } else if (field === 'en_name') {
        valueA = a['en_name'];
        valueB = b['en_name'];
      } else if (field === 'ar_name') {
        valueA = a['ar_name'];
        valueB = b['ar_name'];
      } else if (field === 'active_status') {
        valueA = a['active_status'];
        valueB = b['active_status'];
      } else {
        valueA = (a as any)[field];
        valueB = (b as any)[field];
      }
      if (valueA < valueB) {
        return order === -1 ? -1 : 1;
      } else if (valueA > valueB) {
        return order === -1 ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
  }

  toggleStatus(item: T) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    const action$ = item.active_status
      ? this.genericDataService.disable<T>(this.entityType, item.id)
      : this.genericDataService.enable<T>(this.entityType, item.id);
    action$.subscribe({
      next: (response) => {
        const index = this.data.findIndex(d => d.id === item.id);
        if (index !== -1) {
          this.data[index] = { 
            ...this.data[index], 
            active_status: this.normalizeActiveStatus(response.data.active_status)
          };
        }
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: response.message
        });
        this.ngxSpinnerService.hide('actionsLoader');
        this.cdRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update ${this.title.toLowerCase()} status`
        });
        this.ngxSpinnerService.hide('actionsLoader');
        this.cdRef.detectChanges();
      }
    });
  }

  getPagination(): number[] {
    const dataLength = this.data.length;
    return [10, 25, 50, 100,dataLength].filter(opt => opt <= dataLength);
  }

  runSpinner() {
    this.ngxSpinnerService.show('actionsLoader');
  }

  truncateText(text: string, maxLength: number = 50): string {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

 formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  getImageUrl(image: string): string {
    return `${IMAGE_BASE_URL}${image}`;
  }
onCategoryFilterChange(id: string | null ) {
 
    this.selectedCategory = id;
    this.applyFilters(); 
  
}
onNeedCallFilterChange(value: string | null): void {
    this.selectedNeedCall = value;
    this.applyFilters(); 
  }
}