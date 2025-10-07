import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Category } from '../../../categories/services/categories.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BuildingInsurance } from '../../../property-insurance/services/property-insurance.service';
import {  BuildingRequest } from '../../services/property-requests.service';
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component"

interface TableRow {
  field: string;
  header: string;
  value: any;
  type?: string;
}

@Component({
  selector: 'app-building-request-view',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, NgxSpinnerModule, LoadingDataBannerComponent],
  template: `
    <p-toast position="top-right" [baseZIndex]="5000"></p-toast>

    <ngx-spinner
      name="actionsLoader"
      bdColor="rgba(0, 0, 0, 0.8)"
      size="medium"
      color="#fff"
      type="square-spin"
      [fullScreen]="true">
      <p class="text-white">Loading...</p>
    </ngx-spinner>

    @if (isLoading) {
      <app-loading-data-banner></app-loading-data-banner>
    }
    @else if (buildingRequest) {
      <div class="card" [class.loading]="isLoading">
        <div class="card-header">
          <h2 class="card-title">Building Request Details</h2>
        </div>

        <div class="detail-section">
          @for (row of buildingRequestData; track row.field) {
            <div class="detail-row">
              <div class="detail-label font-bold">{{ row.header }}</div>
              <div class="detail-value">
                @if (row.type === 'boolean') {
                  <span
                    [ngClass]="{
                      'text-green-600 font-semibold': row.value,
                      'text-red-500 italic': !row.value
                    }">
                    {{ row.value ? 'Active' : 'Not Active' }}
                  </span>
                } @else {
                  {{ row.value }}
                }
              </div>
            </div>
          }
        </div>

        <div class="action-buttons flex gap-2 justify-end">
          <a href="/dashboard/menu/building-requests">
            <p-button label="Back" styleClass="p-button-text"></p-button>
          </a>
          @if (buildingRequest.id) {
            <a href="/dashboard/menu/building-requests/edit/{{buildingRequest.id}}">
              <p-button label="Edit" styleClass="p-button-outlined"></p-button>
            </a>
          }
        </div>
      </div>

      @if (buildingRequest.user) {
        <div class="card mt-4" [class.loading]="isLoading">
          <div class="card-header">
            <h2 class="card-title">User Details</h2>
          </div>

          <div class="detail-section">
            @for (row of userData; track row.field) {
              <div class="detail-row">
                <div class="detail-label font-bold">{{ row.header }}</div>
                <div class="detail-value">
                  @if (row.type === 'boolean') {
                    <span
                      [ngClass]="{
                        'text-green-600 font-semibold': row.value,
                        'text-red-500 italic': !row.value
                      }">
                      {{ row.value ? 'Active' : 'Not Active' }}
                    </span>
                  } @else {
                    {{ row.value }}
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (category) {
        <div class="card mt-4" [class.loading]="isLoading">
          <div class="card-header">
            <h2 class="card-title">Category Details</h2>
          </div>

          <div class="detail-section">
            @for (row of categoryData; track row.field) {
              <div class="detail-row">
                <div class="detail-label font-bold">{{ row.header }}</div>
                <div class="detail-value">
                  @if (row.type === 'link') {
                    <a [href]="row.value" target="_blank" class="link hover:underline text-primary-600">
                      Link
                    </a>
                  } @else if (row.type === 'boolean') {
                    <span
                      [ngClass]="{
                        'text-green-600 font-semibold': row.value,
                        'text-red-500 italic': !row.value
                      }">
                      {{ row.value ? 'Active' : 'Not Active' }}
                    </span>
                  } @else {
                    {{ row.value }}
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (buildingInsurance) {
        <div class="card mt-4" [class.loading]="isLoading">
          <div class="card-header">
            <h2 class="card-title">Building Insurance Details</h2>
          </div>

          <div class="detail-section">
            @for (row of buildingInsuranceData; track row.field) {
              <div class="detail-row">
                <div class="detail-label font-bold">{{ row.header }}</div>
                <div class="detail-value">
                  @if (row.type === 'boolean') {
                    <span
                      [ngClass]="{
                        'text-green-600 font-semibold': row.value,
                        'text-red-500 italic': !row.value
                      }">
                      {{ row.value ? 'Active' : 'Not Active' }}
                    </span>
                  } @else {
                    {{ row.value }}
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    }
    @else {
      <div class="card no-data-card">
        <div class="no-data-message flex flex-col items-center justify-center p-8 text-center">
          <i class="pi pi-exclamation-circle text-4xl text-yellow-500 mb-4"></i>
          <p class="text-lg font-medium">No building request data found</p>
        </div>
        <div class="action-buttons flex justify-center pb-4">
          <a href="/dashboard/menu/building-requests">
            <p-button label="Back to Building Requests" styleClass="p-button-text"></p-button>
          </a>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
    }
    .card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    .card-header {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }
    .detail-section {
      display: grid;
      gap: 1rem;
    }
    .detail-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      align-items: start;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-label {
      font-weight: 700;
      color: #374151;
    }
    .detail-value {
      color: #4b5563;
    }
    .no-data-card {
      text-align: center;
      padding: 2rem;
    }
    .no-data-message {
      color: #4b5563;
    }
    .action-buttons {
      margin-top: 1rem;
    }
    .text-primary-600 {
      color: #2563eb;
    }
    .loading {
      opacity: 0.5;
      pointer-events: none;
    }
    @media (max-width: 640px) {
      .detail-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      .detail-label {
        margin-bottom: 0.25rem;
      }
    }
  `]
})
export class ViewPropertyRequestsComponent implements OnInit {
  buildingRequest: BuildingRequest | null = null;
  category: Category | null = null;
  buildingInsurance: BuildingInsurance | null = null;
  isLoading: boolean = true;

  buildingRequestData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  buildingInsuranceData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      console.log(data);

      this.buildingRequest = data['data'].buildingRequest.data;
      this.category = data['data'].category.data;
      this.buildingInsurance = data['data'].buildingInsurance.data;

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
      this.isLoading = false;
    });
  }

  prepareTableData(): void {
    if (this.buildingRequest) {
      this.buildingRequestData = [
        { field: 'id', header: 'ID', value: this.buildingRequest.id || 'N/A' },
        { field: 'payment_method', header: 'Payment Method', value: this.buildingRequest.payment_method || 'N/A' },
        { field: 'building_insurance_number', header: 'Building Insurance Number', value: this.buildingRequest.building_insurance_number || 'N/A' },
        { field: 'admin_building_insurance_number', header: 'Admin Building  Number', value: this.buildingRequest.admin_building_insurance_number || 'N/A' },
        { field: 'name', header: 'Name', value: this.buildingRequest.name || 'N/A' },
        { field: 'email', header: 'Email', value: this.buildingRequest.email || 'N/A' },
        { field: 'phone', header: 'Phone', value: this.buildingRequest.phone || 'N/A' },
        { field: 'building_type', header: 'Building Type', value: this.buildingRequest.building_type || 'N/A' },
        { field: 'building_country', header: 'Building Country', value: this.buildingRequest.building_country || 'N/A' },
        { field: 'building_price', header: 'Building Price', value: this.buildingRequest.building_price || 'N/A' },
        { field: 'company_building_total_money', header: 'Total buildings mony', value: this.buildingRequest.company_building_total_money || 'N/A' },
        { field: 'request_type', header: 'Request Type', value: this.buildingRequest.request_type || 'individual' },
        { field: 'company_building_number', header: 'Company Building Number', value: this.buildingRequest.company_building_number || 'N/A' },
        { field: 'start_date', header: 'Start Date', value: this.buildingRequest.start_date ? this.formatDate(this.buildingRequest.start_date) : 'N/A' },
        { field: 'duration', header: 'Duration', value: this.buildingRequest.duration ? `${this.buildingRequest.duration} years` : 'N/A' },
        { field: 'end_date', header: 'End Date', value: this.buildingRequest.end_date ? this.formatDate(this.buildingRequest.end_date) : 'N/A' },
        { field: 'active_status', header: 'Active Status', value: this.buildingRequest.active_status, type: 'boolean' },
        { field: 'created_at', header: 'Created At', value: this.buildingRequest.created_at ? this.formatDate(this.buildingRequest.created_at) : 'N/A' },
        { field: 'updated_at', header: 'Updated At', value: this.buildingRequest.updated_at ? this.formatDate(this.buildingRequest.updated_at) : 'N/A' }
      ];

      if (this.buildingRequest.user) {
        this.userData = [
          { field: 'user_id', header: 'ID', value: this.buildingRequest.user.id || 'N/A' },
          { field: 'user_name', header: 'Name', value: this.buildingRequest.user.name || 'N/A' },
          { field: 'user_email', header: 'Email', value: this.buildingRequest.user.email || 'N/A' },
          { field: 'user_phone', header: 'Phone', value: this.buildingRequest.user.phone || 'N/A' },
          { field: 'user_gender', header: 'Gender', value: this.buildingRequest.user.gender || 'N/A' },
          { field: 'user_birth_date', header: 'Birth Date', value: this.buildingRequest.user.birth_date || 'N/A' },
          { field: 'user_role', header: 'Role', value: this.buildingRequest.user.role || 'N/A' },
          { field: 'user_created_at', header: 'Created At', value: this.buildingRequest.user.created_at ? this.formatDate(this.buildingRequest.user.created_at) : 'N/A' },
          { field: 'user_updated_at', header: 'Updated At', value: this.buildingRequest.user.updated_at ? this.formatDate(this.buildingRequest.user.updated_at) : 'N/A' }
        ];
      }
    }

    if (this.category) {
      this.categoryData = [
        { field: 'category_id', header: 'ID', value: this.category.id || 'N/A' },
        { field: 'category_en_title', header: 'English Title', value: this.category.en_title || 'N/A' },
        { field: 'category_network_link', header: 'Network Link', value: this.category.network_link || 'N/A', type: 'link' },
        { field: 'category_counter_number', header: 'Counter Number', value: this.category.counter_number || 'N/A' },
        { field: 'category_created_at', header: 'Created At', value: this.category.created_at ? this.formatDate(this.category.created_at) : 'N/A' }
      ];
    }

    if (this.buildingInsurance) {
      this.buildingInsuranceData = [
        { field: 'insurance_id', header: 'ID', value: this.buildingInsurance.id || 'N/A' },
        { field: 'insurance_en_title', header: 'English Title', value: this.buildingInsurance.en_title || 'N/A' },
        { field: 'insurance_company_name', header: 'Company Name', value: this.buildingInsurance.company_name || 'N/A' },
        { field: 'insurance_year_money', header: 'Yearly Cost', value: this.buildingInsurance.year_money || 'N/A' },
        { field: 'insurance_created_at', header: 'Created At', value: this.buildingInsurance.created_at ? this.formatDate(this.buildingInsurance.created_at) : 'N/A' },
        { field: 'insurance_updated_at', header: 'Updated At', value: this.buildingInsurance.updated_at ? this.formatDate(this.buildingInsurance.updated_at) : 'N/A' }
      ];
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }

    const match = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return dateString;
    const [, day, month, year] = match;
    return `${month}/${day}/${year}`;
  }
}
