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
import { TestimonialsService, Testimonial } from '../../services/testimonial.service';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-all-testimonials',
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
    NgxSpinnerModule
  ],
  templateUrl: './all-testimonials.component.html',
  styleUrl: './all-testimonials.component.scss',
  providers: [MessageService]
})
export class AllTestimonialsComponent {
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private testimonialsService = inject(TestimonialsService);

  isLoading: boolean = false;
  testimonials: Testimonial[] = [];
  filteredTestimonials: Testimonial[] = [];
  totalRecords: number = 0;
  rowsPerPage = 10;
  selectedStatus: string | null = null;
  selectOptions: SelectOption[] = [];
  sortField: string | null = null;
  sortOrder: number = 1;
  currentPage: number = 1;

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchTestimonials();
    this.ngxSpinnerService.hide('actionsLoader');

  }

  constructor(private cdRef: ChangeDetectorRef) {}

  initDropDownFilter(): void {
    this.selectOptions = [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' }
    ];
  }

  fetchTestimonials() {
    this.ngxSpinnerService.show();
    this.isLoading=true;
    this.testimonialsService.getAll().subscribe({
      next: (response) => {
        this.testimonials = response.data.map(testimonial => ({
          ...testimonial,
          active_status: Number(testimonial.active_status)
        }));
        this.applyFilters();
        this.isLoading=false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load testimonials'
        });
        this.isLoading=false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.testimonials];

    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((t) => t.active_status.toString() === this.selectedStatus);
    }

    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField!, this.sortOrder));
    }

    this.filteredTestimonials = filtered;
    this.totalRecords = filtered.length;
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value.toLowerCase();
    let filtered = [...this.testimonials];

    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((t) => t.active_status.toString() === this.selectedStatus);
    }

    if (value) {
      filtered = filtered.filter((t) =>
        t.id.toString().includes(value) ||
        t.en_name.toLowerCase().includes(value) ||
        t.en_job.toLowerCase().includes(value) ||
        (t.active_status ? 'active' : 'inactive').includes(value) ||
        t.created_at.toLowerCase().includes(value)
      );
    }

    if (this.sortField) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortField!, this.sortOrder));
    }

    this.filteredTestimonials = filtered;
    this.totalRecords = filtered.length;
  }

  compareValues(a: Testimonial, b: Testimonial, field: string, order: number): number {
    let valueA: any;
    let valueB: any;

    if (field === 'id') {
      valueA = Number(a.id);
      valueB = Number(b.id);
    } else if (field === 'en_name') {
      valueA = a.en_name;
      valueB = b.en_name;
    } else if (field === 'en_job') {
      valueA = a.en_job;
      valueB = b.en_job;
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

  toggleTestimonialStatus(testimonial: Testimonial) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    
    const action$ = testimonial.active_status === 1 
      ? this.testimonialsService.disable(testimonial.id)
      : this.testimonialsService.enable(testimonial.id);

    action$.subscribe({
      next: (response) => {
        testimonial.active_status = response.data.active_status;
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
          detail: 'Failed to update testimonial status'
        });
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  deleteTestimonial(testimonial: Testimonial) {
    if (confirm(`Are you sure you want to delete "${testimonial.en_name}"?`)) {
      this.ngxSpinnerService.show('actionsLoader');
      this.testimonialsService.disable(testimonial.id).subscribe({
        next: () => {
          this.testimonials = this.testimonials.filter(t => t.id !== testimonial.id);
          this.applyFilters();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Testimonial deleted successfully'
          });
          this.ngxSpinnerService.hide('actionsLoader');
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete testimonial'
          });
          this.ngxSpinnerService.hide('actionsLoader');
        }
      });
    }
  }

  getPagination(): number[] {
    return [10, 25, 50, 100].sort((a, b) => a - b);
  }

  runSpinner() {
    this.ngxSpinnerService.show('actionsLoader');
  }

  truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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