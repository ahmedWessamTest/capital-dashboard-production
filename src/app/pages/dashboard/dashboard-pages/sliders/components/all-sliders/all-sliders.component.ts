import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Slider, SlidersService } from '../../service/sliders.service';
import { IMAGE_BASE_URL } from '../../../../../../core/constants/WEB_SITE_BASE_UTL';
import { ImageLoaderDirective } from '../../../../../../core/directives/image-loading.directive';

interface SelectOption {
  label: string;
  value: string; // '1' or '0' for filter dropdown
}

@Component({
  selector: 'app-all-sliders',
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
  templateUrl: './all-sliders.component.html',
  styleUrl: './all-sliders.component.scss',
  providers: [MessageService]
})
export class AllSlidersComponent {
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private slidersService = inject(SlidersService);
 isLoading:boolean=true;
  sliders: Slider[] = [];
  filteredSliders: Slider[] = [];
  totalRecords: number = 0;
  rowsPerPage = 10;
  selectedStatus: string | null = null;
  selectOptions: SelectOption[] = [];
  sortField: string | null = null;
  sortOrder: number = 1; // 1 for ascending, -1 for descending
  currentPage: number = 1;

  private readonly IMAGE_BASE_URL = IMAGE_BASE_URL

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchSliders();
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  initDropDownFilter(): void {
    this.selectOptions = [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' }
    ];
  }

  fetchSliders() {
    // this.ngxSpinnerService.show("actionsLoader");
    this.isLoading=true;
    this.slidersService.getAll().subscribe({
      next: (response) => {
        this.sliders = response.data.map(slider => ({
          ...slider,
          active_status: Number(slider.active_status),
          image: slider.image?.trim() || 'placeholder.png'
        }));
        this.applyFilters();
        this.ngxSpinnerService.hide("actionsLoader");
        this.isLoading=false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load sliders'
        });
        // this.ngxSpinnerService.hide();
        this.isLoading=false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.sliders];

    // Apply status filter
    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((slider) => slider.active_status.toString() === this.selectedStatus);
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField!, this.sortOrder));
    }

    this.filteredSliders = filtered;
    this.totalRecords = filtered.length;
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value.toLowerCase();
    let filtered = [...this.sliders];

    // Apply status filter first
    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((slider) => slider.active_status.toString() === this.selectedStatus);
    }

    // Apply global search
    if (value) {
      filtered = filtered.filter((slider) =>
        slider.id.toString().includes(value) ||
        slider.en_title.toLowerCase().includes(value) ||
        (slider.image || '').toLowerCase().includes(value) ||
        (slider.active_status ? 'active' : 'inactive').includes(value) ||
        slider.created_at.toLowerCase().includes(value)
      );
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField!, this.sortOrder));
    }

    this.filteredSliders = filtered;
    this.totalRecords = filtered.length;
  }

  compareValues(a: Slider, b: Slider, field: string, order: number): number {
    let valueA: any;
    let valueB: any;

    if (field === 'id') {
      valueA = Number(a.id);
      valueB = Number(b.id);
    } else if (field === 'en_title') {
      valueA = a.en_title;
      valueB = b.en_title;
    } else if (field === 'active_status') {
      valueA = a.active_status;
      valueB = b.active_status;
    } else if (field === 'created_at' || field === 'updated_at') {
      valueA = new Date((a as any)[field]);
      valueB = new Date((b as any)[field]);
    } else {
      valueA = (a as any)[field];
      valueB = (b as any)[field];
    }

    if (valueA === null || valueA === undefined) return order * -1;
    if (valueB === null || valueB === undefined) return order * 1;

    if (valueA < valueB) {
      return order * -1;
    } else if (valueA > valueB) {
      return order * 1;
    } else {
      return 0;
    }
  }

  onFilterChange(value: string | null): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
  }

  toggleSliderStatus(slider: Slider) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    
    const action$ = slider.active_status === 1 
      ? this.slidersService.disable(slider.id)
      : this.slidersService.enable(slider.id);

    action$.subscribe({
      next: (response) => {
        slider.active_status = response.data.active_status;
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
          detail: 'Failed to update slider status'
        });
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  deleteSlider(slider: Slider) {
    if (confirm(`Are you sure you want to delete "${slider.en_title}"?`)) {
      this.ngxSpinnerService.show('actionsLoader');
      this.slidersService.disable(slider.id).subscribe({
        next: () => {
          this.sliders = this.sliders.filter(s => s.id !== slider.id);
          this.applyFilters();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Slider deleted successfully'
          });
          this.ngxSpinnerService.hide('actionsLoader');
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete slider'
          });
          this.ngxSpinnerService.hide('actionsLoader');
        }
      });
    }
  }

  getPagination(): number[] {
    return [10, 25, 50, 100].sort((a, b) => a - b);
  }

  getImageUrl(image: string): string {
    return `${this.IMAGE_BASE_URL}${image}`;
  }



  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    img.classList.remove('loaded');
  }

  runSpinner() {
    this.ngxSpinnerService.show('actionsLoader');
  }

  // Helper method to truncate long text
  truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Helper method to format date
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