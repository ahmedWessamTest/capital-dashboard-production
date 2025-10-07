import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MedicalInsurance, MedicalRequest, MedicalRequestResponse } from '../../services/medical-requests.service';
import { Category } from '../../../categories/services/categories.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";

interface MedicalRequestCombinedResponse {
  medicalRequest: MedicalRequestResponse;
  category: { data: Category };
  medicalInsurance: { data: MedicalInsurance };
}

interface TableRow {
  field: string;
  header: string;
  value: any;
  type?: string;
}

@Component({
  selector: 'app-medical-request-view',
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
    @else if (medicalRequest) {
      <div class="card" [class.loading]="isLoading">
        <div class="card-header">
          <h2 class="card-title">Medical Request Details</h2>
        </div>

        <div class="detail-section">
          @for (row of medicalRequestData; track row.field) {
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
          <a href="/dashboard/menu/medical-requests">
            <p-button label="Back" styleClass="p-button-text"></p-button>
          </a>
          @if (medicalRequest.id) {
            <a href="/dashboard/menu/medical-requests/edit/{{medicalRequest.id}}">
              <p-button label="Edit" styleClass="p-button-outlined"></p-button>
            </a>
          }
        </div>
      </div>

      @if (medicalRequest.user) {
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

      @if (medicalInsurance) {
        <div class="card mt-4" [class.loading]="isLoading">
          <div class="card-header">
            <h2 class="card-title">Medical Insurance Details</h2>
          </div>

          <div class="detail-section">
            @for (row of medicalInsuranceData; track row.field) {
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
          <p class="text-lg font-medium">No medical request data found</p>
        </div>
        <div class="action-buttons flex justify-center pb-4">
          <a href="/dashboard/menu/medical-requests">
            <p-button label="Back to Medical Requests" styleClass="p-button-text"></p-button>
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
export class ViewMedicalRequestsComponent implements OnInit {
  medicalRequest: MedicalRequest | null = null;
  category: Category | null = null;
  medicalInsurance: MedicalInsurance | null = null;
  isLoading: boolean = true;

  medicalRequestData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  medicalInsuranceData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log("View medical request component initialized");
    this.route.data.subscribe((data: any) => {
      console.log("Resolver data:", data);
      this.medicalRequest = data['data'].medicalRequest.data;
      this.category = data['data'].category.data;
      this.medicalInsurance = data['data'].medicalInsurance.data;

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
      this.isLoading = false;
    });
  }

  prepareTableData(): void {
    if (this.medicalRequest) {
      this.medicalRequestData = [
        { field: 'id', header: 'ID', value: this.medicalRequest.id || 'N/A' },
        { field: 'payment_Method', header: 'Payment Method', value: this.medicalRequest.payment_method || 'N/A' },
        { field: 'medical_insurance_number', header: 'Medical Insurance Number', value: this.medicalRequest.medical_insurance_number || 'N/A' },
        { field: 'admin_medical_insurance_number', header: 'Admin Medical  Number', value: this.medicalRequest.admin_medical_insurance_number || 'N/A' },
        { field: 'name', header: 'Name', value: this.medicalRequest.name || 'N/A' },
        { field: 'email', header: 'Email', value: this.medicalRequest.email || 'N/A' },
        { field: 'phone', header: 'Phone', value: this.medicalRequest.phone || 'N/A' },
        { field: 'birthdate', header: 'Birthdate', value: this.medicalRequest.birthdate || 'N/A' },
        { field: 'gender', header: 'Gender', value: this.medicalRequest.gender || 'N/A' },
        { field: 'request_type', header: 'Request Type', value: this.medicalRequest.request_type || 'N/A' },
        { field: 'company_building_number', header: 'Number of employees', value: this.medicalRequest.company_employee_number || 'individual' },
        { field: 'start_date', header: 'Start Date', value: this.medicalRequest.start_date ? this.formatDate(this.medicalRequest.start_date) : 'N/A' },
        { field: 'duration', header: 'Duration', value: this.medicalRequest.duration ? `${this.medicalRequest.duration} years` : 'N/A' },
        { field: 'end_date', header: 'End Date', value: this.medicalRequest.end_date ? this.formatDate(this.medicalRequest.end_date) : 'N/A' },
        { field: 'active_status', header: 'Active Status', value: this.medicalRequest.active_status, type: 'boolean' },
        { field: 'created_at', header: 'Created At', value: this.medicalRequest.created_at ? this.formatDate(this.medicalRequest.created_at) : 'N/A' },
        { field: 'updated_at', header: 'Updated At', value: this.medicalRequest.updated_at ? this.formatDate(this.medicalRequest.updated_at) : 'N/A' }
      ];

      if (this.medicalRequest.user) {
        this.userData = [
          { field: 'user_id', header: 'ID', value: this.medicalRequest.user.id || 'N/A' },
          { field: 'user_name', header: 'Name', value: this.medicalRequest.user.name || 'N/A' },
          { field: 'user_email', header: 'Email', value: this.medicalRequest.user.email || 'N/A' },
          { field: 'user_phone', header: 'Phone', value: this.medicalRequest.user.phone || 'N/A' },
          { field: 'user_gender', header: 'Gender', value: this.medicalRequest.user.gender || 'N/A' },
          { field: 'user_birth_date', header: 'Birth Date', value: this.medicalRequest.user.birth_date || 'N/A' },
          { field: 'user_role', header: 'Role', value: this.medicalRequest.user.role || 'N/A' },
          { field: 'user_created_at', header: 'Created At', value: this.medicalRequest.user.created_at ? this.formatDate(this.medicalRequest.user.created_at) : 'N/A' },
          { field: 'user_updated_at', header: 'Updated At', value: this.medicalRequest.user.updated_at ? this.formatDate(this.medicalRequest.user.updated_at) : 'N/A' }
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

    if (this.medicalInsurance) {
      this.medicalInsuranceData = [
        { field: 'insurance_id', header: 'ID', value: this.medicalInsurance.id || 'N/A' },
        { field: 'insurance_en_title', header: 'English Title', value: this.medicalInsurance.en_title || 'N/A' },
        { field: 'insurance_company_name', header: 'Company Name', value: this.medicalInsurance.company_name || 'N/A' },
        { field: 'insurance_year_money', header: 'Yearly Cost', value: this.medicalInsurance.year_money || 'N/A' },
        { field: 'insurance_created_at', header: 'Created At', value: this.medicalInsurance.created_at ? this.formatDate(this.medicalInsurance.created_at) : 'N/A' },
        { field: 'insurance_updated_at', header: 'Updated At', value: this.medicalInsurance.updated_at ? this.formatDate(this.medicalInsurance.updated_at) : 'N/A' }
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
