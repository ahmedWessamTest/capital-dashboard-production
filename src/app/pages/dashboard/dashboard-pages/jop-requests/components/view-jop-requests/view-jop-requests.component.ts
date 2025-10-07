import { JobRequest } from './../../services/jop-requests.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { IMAGE_BASE_URL } from '../../../../../../core/constants/WEB_SITE_BASE_UTL';
import { IJopInsurance } from '../../../../../../jop-insurance/res/interface/getAllJop';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { Category } from '../../../categories/services/categories.service';

interface JobRequestCombinedResponse {
  jobRequest: { success: boolean; message: string; data: JobRequest };
  category: { data: Category };
  jobInsurance: { data: IJopInsurance };
}

interface TableRow {
  field: string;
  header: string;
  value: any;
  type?: string;
}

@Component({
  selector: 'app-view-jop-requests',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    NgxSpinnerModule,
    LoadingDataBannerComponent,
  ],
  templateUrl: './view-jop-requests.component.html',
  styles: [
    `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .card.loading {
        opacity: 0.5;
        pointer-events: none;
      }
      .card-header {
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
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .detail-row.flex {
        display: flex;
        align-items: center;
      }
      .detail-label {
        font-weight: 500;
        color: #4b5563;
        text-transform: capitalize;
      }
      .detail-value {
        color: #1f2937;
      }
      .image-container {
        position: relative;
        width: 100px;
        height: 100px;
      }
      .category-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .category-image.loaded {
        opacity: 1;
      }
      .image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #e5e7eb;
        border-radius: 4px;
      }
      .link {
        color: #2563eb;
        text-decoration: underline;
      }
      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
      }
      .no-data-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        text-align: center;
      }
      .no-data-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #4b5563;
        font-size: 1.125rem;
      }
      .no-data-message i {
        font-size: 1.5rem;
        color: #dc2626;
      }
    `,
  ],
})
export class ViewJopRequestsComponent implements OnInit {
  jobRequest: JobRequest | null = null;
  category: Category | null = null;
  jobInsurance: IJopInsurance | null = null;
  isLoading = true;
  imageLoaded = false;
  IMAGE_BASE_URL = IMAGE_BASE_URL;

  jobRequestData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  jobInsuranceData: TableRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.ngxSpinnerService.show('actionsLoader');

    this.route.data.subscribe((data: any) => {
      console.log('Resolver data:', data);

      const resolvedData = data?.['data'] || {};

      this.jobRequest = resolvedData.jobRequest?.data || resolvedData.jobRequest || null;
      this.category = resolvedData.category?.data || resolvedData.category || null;

      // جرب الاتنين حسب شكل الـ API
      this.jobInsurance = resolvedData.jobInsurance?.data || resolvedData.jobInsurance || null;

      this.prepareTableData();

      this.isLoading = false;
      this.ngxSpinnerService.hide('actionsLoader');
    });
  }

  prepareTableData(): void {
    if (this.jobRequest) {
      this.jobRequestData = [
        { field: 'id', header: 'ID', value: this.jobRequest.id || 'N/A' },
        {
          field: 'payment_method',
          header: 'Payment Method',
          value: this.jobRequest.payment_method || 'N/A',
        },
        {
          field: 'jop_insurance_number',
          header: 'Professional Insurance Number',
          value: this.jobRequest.jop_insurance_number || 'N/A',
        },
        {
          field: 'admin_jop_insurance_number',
          header: 'Admin Professional Insurance Number',
          value: this.jobRequest.admin_jop_insurance_number || 'N/A',
        },
        { field: 'name', header: 'Name', value: this.jobRequest.name || 'N/A' },
        {
          field: 'email',
          header: 'Email',
          value: this.jobRequest.email || 'N/A',
        },
        {
          field: 'phone',
          header: 'Phone',
          value: this.jobRequest.phone || 'N/A',
        },
        {
          field: 'birthdate',
          header: 'Birth Date',
          value: this.jobRequest.birthdate || 'N/A',
        },
        {
          field: 'gender',
          header: 'Gender',
          value: this.jobRequest.gender || 'N/A',
        },
        {
          field: 'job_title',
          header: 'professional Title',
          value: this.jobRequest.job_title || 'N/A',
        },
        {
          field: 'company_name',
          header: 'Company Name',
          value: this.jobRequest.company_name || 'N/A',
        },

        {
          field: 'profession_name',
          header: 'Profession',
          value: this.jobRequest.jop_title || 'N/A',
        },
        {
          field: 'salary',
          header: 'Salary',
          value: this.jobRequest.jop_price
            ? `${this.jobRequest.jop_price} LE`
            : 'N/A',
        },
        { field: 'request_type', header: 'Request Type', value: this.jobRequest.request_type || 'individual' },
        { field: 'company_building_number', header: 'Number of employees', value: this.jobRequest.company_employee_number || 'N/A' },
        {
          field: 'start_date',
          header: 'Start Date',
          value: this.jobRequest.start_date
            ? this.formatDate(this.jobRequest.start_date)
            : 'N/A',
        },
        {
          field: 'duration',
          header: 'Duration',
          value: this.jobRequest.duration
            ? `${this.jobRequest.duration} years`
            : 'N/A',
        },
        {
          field: 'end_date',
          header: 'End Date',
          value: this.jobRequest.end_date
            ? this.formatDate(this.jobRequest.end_date)
            : 'N/A',
        },
        {
          field: 'active_status',
          header: 'Active Status',
          value: this.jobRequest.active_status || 'N/A',
          type: 'boolean',
        },
        {
          field: 'created_at',
          header: 'Created At',
          value: this.jobRequest.created_at
            ? this.formatDate(this.jobRequest.created_at)
            : 'N/A',
        },
        {
          field: 'updated_at',
          header: 'Updated At',
          value: this.jobRequest.updated_at
            ? this.formatDate(this.jobRequest.updated_at)
            : 'N/A',
        },
        {
          field: 'jop_main_id',
          header: 'professional Main ID',
          value: this.jobRequest.jop_main_id
            ? this.formatDate(this.jobRequest.jop_main_id)
            : 'N/A',
          type: 'image',
        },
        {
          field: 'jop_second_id',
          header: 'professional Second ID',
          value: this.jobRequest.jop_second_id
            ? this.formatDate(this.jobRequest.jop_second_id)
            : 'N/A',
          type: 'image',
        },
      ];

      if (this.jobRequest.user) {
        this.userData = [
          {
            field: 'id',
            header: 'ID',
            value: this.jobRequest.user.id || 'N/A',
          },
          {
            field: 'name',
            header: 'Name',
            value: this.jobRequest.user.name || 'N/A',
          },
          {
            field: 'email',
            header: 'Email',
            value: this.jobRequest.user.email || 'N/A',
          },
          {
            field: 'phone',
            header: 'Phone',
            value: this.jobRequest.user.phone || 'N/A',
          },
          {
            field: 'gender',
            header: 'Gender',
            value: this.jobRequest.user.gender || 'N/A',
          },
          {
            field: 'birth_date',
            header: 'Birth Date',
            value: this.jobRequest.user.birth_date || 'N/A',
          },
          {
            field: 'role',
            header: 'Role',
            value: this.jobRequest.user.role || 'N/A',
          },
          {
            field: 'created_at',
            header: 'Created At',
            value: this.jobRequest.user.created_at
              ? this.formatDate(this.jobRequest.user.created_at)
              : 'N/A',
          },
          {
            field: 'updated_at',
            header: 'Updated At',
            value: this.jobRequest.user.updated_at
              ? this.formatDate(this.jobRequest.user.updated_at)
              : 'N/A',
          },
        ];
      }
    }

    if (this.category) {
      this.categoryData = [
        { field: 'id', header: 'ID', value: this.category.id || 'N/A' },
        {
          field: 'en_title',
          header: 'English Title',
          value: this.category.en_title || 'N/A',
        },
        {
          field: 'network_link',
          header: 'Network Link',
          value: this.category.network_link || 'N/A',
          type: 'link',
        },
        {
          field: 'counter_number',
          header: 'Counter Number',
          value: this.category.counter_number || 'N/A',
        },
        {
          field: 'created_at',
          header: 'Created At',
          value: this.category.created_at
            ? this.formatDate(this.category.created_at)
            : 'N/A',
        },
      ];
    }

    if (this.jobInsurance) {
      this.jobInsuranceData = [
        { field: 'id', header: 'ID', value: this.jobInsurance.id || 'N/A' },
        {
          field: 'en_title',
          header: 'English Title',
          value: this.jobInsurance.en_title || 'N/A',
        },
        {
          field: 'company_name',
          header: 'Company Name',
          value: this.jobInsurance.company_name || 'N/A',
        },
        {
          field: 'year_money',
          header: 'Yearly Cost',
          value: this.jobInsurance.year_money || 'N/A',
        },
        {
          field: 'month_money',
          header: 'Monthly Cost',
          value: this.jobInsurance.month_money || 'N/A',
        },
        {
          field: 'created_at',
          header: 'Created At',
          value: this.jobInsurance.created_at
            ? this.formatDate(this.jobInsurance.created_at)
            : 'N/A',
        },
        {
          field: 'updated_at',
          header: 'Updated At',
          value: this.jobInsurance.updated_at
            ? this.formatDate(this.jobInsurance.updated_at)
            : 'N/A',
        },
      ];
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    // Handle ISO format (e.g., 2025-06-03T16:58:54.000000Z) for created_at/updated_at
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }

    // Handle dd-MM-yyyy format (e.g., 12-11-2025) for start_date/end_date
    const match = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return dateString;
    const [, day, month, year] = match;
    return `${month}/${day}/${year}`;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}
