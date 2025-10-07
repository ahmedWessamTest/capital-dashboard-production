import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

interface CombinedLead {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  phone: string | null;
  email?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  need_call?: string | null;
  lead_type?: string | null;
  created_at: string;
  updated_at: string;
  car_type?: string | null;
  car_brand?: string | null;
  car_model?: string | null;
  car_year?: string | null;
  car_price?: string | null;
  building_insurance_number?: string | null;
  building_type?: string | null;
  building_country?: string | null;
  building_city?: string | null;
  building_price?: string | null;
  status?: string | null;
}

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-a-all-leads',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
  ],
  templateUrl: './all-leads.component.html',
  styleUrl: './all-leads.component.scss',
  providers: [MessageService],
})
export class AllLeadsComponent {
  leads: CombinedLead[] = [];
  filteredLeads: CombinedLead[] = [];
  isLoading = signal<boolean>(false);
  leadTypeData: { value: string, label: string }[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'corporate', label: 'Corporate' }
  ]
  categoryData: { value: number; label: string }[] = [
    { value: 1, label: 'Medical' },
    { value: 2, label: 'Motor' },
    { value: 3, label: 'Building' },
    { value: 5, label: 'Jop' },
  ];
  needCallOptions: SelectOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedCategory: number | null = null;
  selectedNeedCall: string | null = null;
  selectedLeadType: string | null = null;
  totalRecords: number = 0;
  rowsPerPage = 10;

  @ViewChild('dt') dt: Table | undefined;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.ngxSpinnerService.show('actionsLoader');
    this.isLoading.set(true);
    this.route.data.subscribe({
      next: (data: any) => {
        console.log(data);
        this.leads = data.data?.combinedLeads || [];
        this.filteredLeads = [...this.leads];
        this.totalRecords = this.leads.length;
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load leads',
        });
        this.ngxSpinnerService.hide('actionsLoader');
        this.isLoading.set(false);
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.leads];

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (lead) => lead.category_id === this.selectedCategory
      );
    }

    if (this.selectedNeedCall !== null && this.selectedNeedCall !== '') {
      filtered = filtered.filter(
        (lead) => lead.need_call?.toLowerCase() === this.selectedNeedCall
      );
    }

    if (this.selectedLeadType !== null && this.selectedLeadType !== '') {
      filtered = filtered.filter(
        (lead) => lead.lead_type?.toLowerCase() === this.selectedLeadType
      );
    }

    this.filteredLeads = filtered;
    this.totalRecords = filtered.length;
    if (this.dt) {
      this.dt.first = 0;
    }
  }

  onGlobalFilter(dt: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    let filtered = [...this.leads];

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (lead) => lead.category_id === this.selectedCategory
      );
    }

    if (this.selectedNeedCall !== null && this.selectedNeedCall !== '') {
      filtered = filtered.filter(
        (lead) => lead.need_call?.toLowerCase() === this.selectedNeedCall
      );
    }

    if (this.selectedLeadType !== null && this.selectedLeadType !== '') {
      filtered = filtered.filter(
        (lead) => lead.lead_type?.toLowerCase() === this.selectedLeadType
      );
    }

    if (value) {
      filtered = filtered.filter((lead) => {
        return (
          lead.id?.toString().includes(value) ||
          false ||
          lead.name?.toLowerCase().includes(value) ||
          false ||
          lead.phone?.toLowerCase().includes(value) ||
          false ||
          lead.category_name?.toLowerCase().includes(value) ||
          false ||
          lead.email?.toLowerCase().includes(value) ||
          false ||
          lead.need_call?.toLowerCase().includes(value) ||
          false ||
          lead.lead_type?.toLowerCase().includes(value) ||
          false
        );
      });
    }

    this.filteredLeads = filtered;
    this.totalRecords = filtered.length;
    if (this.dt) {
      this.dt.first = 0;
    }
  }

  onFilterCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onFilterNeedCallChange(value: string | null): void {
    this.selectedNeedCall = value;
    this.applyFilters();
  }

  onFilterLeadTypeChange(value: string | null): void {
    this.selectedLeadType = value;
    this.applyFilters();
  }

  getPagination(): number[] {
    const dataLength = this.filteredLeads.length;
    return [10, 25, 50, 100, dataLength].filter((opt) => opt <= dataLength);
  }

  onSort(event: any) {
    const field = event.field;
    const order = event.order;
    this.filteredLeads.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      if (field === 'id') {
        valueA = Number(a.id) || 0;
        valueB = Number(b.id) || 0;
      } else if (field === 'name') {
        valueA = a.name || '';
        valueB = b.name || '';
      } else if (field === 'phone') {
        valueA = a.phone || '';
        valueB = b.phone || '';
      } else {
        valueA = (a as any)[field] || '';
        valueB = (b as any)[field] || '';
      }
      if (valueA < valueB) {
        return order === -1 ? -1 : 1;
      } else if (valueA > valueB) {
        return order === -1 ? 1 : -1;
      } else {
        return 0;
      }
    });
    if (this.dt) {
      this.dt.first = 0;
    }
  }

  viewLead(categoryId: number, id: number): void {
    if (categoryId === 1) {
      this.router.navigate(['/dashboard/menu/leads/view-medical-lead', id]);
    } else if (categoryId === 2) {
      this.router.navigate(['/dashboard/menu/leads/view-motor-lead', id]);
    } else if (categoryId === 3) {
      this.router.navigate(['/dashboard/menu/leads/view-building-lead', id]);
    } else if (categoryId === 5) {
      this.router.navigate(['/dashboard/menu/leads/view-jop-lead', id]);
    }
  }
}
