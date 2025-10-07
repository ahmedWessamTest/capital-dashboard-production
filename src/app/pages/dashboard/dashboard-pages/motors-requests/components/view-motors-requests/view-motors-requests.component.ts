import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Category } from '../../../categories/services/categories.service';
import { MotorRequestResponse, MotorInsurance, MotorRequest } from '../../services/motors-requests.service';
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";

interface MotorRequestCombinedResponse {
  motorRequest: MotorRequestResponse;
  category: { data: Category };
  motorInsurance: { data: MotorInsurance };
}

interface TableRow {
  field: string;
  header: string;
  value: any;
  type?: string;
}

@Component({
  selector: 'app-view-motors-requests',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, NgxSpinnerModule, LoadingDataBannerComponent],
  templateUrl: './view-motors-requests.component.html',
  styles: [`
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
  `]
})
export class ViewMotorsRequestsComponent implements OnInit {
  motorRequest: MotorRequest | null = null;
  category: Category | null = null;
  motorInsurance: MotorInsurance | null = null;
  isLoading = true;
  imageLoaded = false;

  motorRequestData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  motorInsuranceData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show('actionsLoader');
    this.route.data.subscribe((data: any) => {
      this.motorRequest = data['data'].motorRequest.data;
      this.category = data['data'].category.data;
      this.motorInsurance = data['data'].motorInsurance.data;
      
      this.prepareTableData();
      this.isLoading = false;
      this.ngxSpinnerService.hide('actionsLoader');
    });
  }

  prepareTableData(): void {
    if (this.motorRequest) {
      this.motorRequestData = [
        { field: 'id', header: 'ID', value: this.motorRequest.id || 'N/A' },
        { field: 'payment_method', header: 'Payment Method', value: this.motorRequest.payment_method || 'N/A' },
        { field: 'motor_insurance_number', header: 'Motor Insurance Number', value: this.motorRequest.motor_insurance_number || 'N/A' },
        { field: 'admin_motor_insurance_number', header: 'Admin Motor Insurance Number', value: this.motorRequest.admin_motor_insurance_number || 'N/A' },
        { field: 'name', header: 'Name', value: this.motorRequest.name || 'N/A' },
        { field: 'email', header: 'Email', value: this.motorRequest.email || 'N/A' },
        { field: 'phone', header: 'Phone', value: this.motorRequest.phone || 'N/A' },
       
        { field: 'car_type', header: 'Car Type', value: this.motorRequest.car_type || 'N/A' },
        { field: 'car_brand', header: 'Car Brand', value: this.motorRequest.car_brand || 'N/A' },
        { field: 'car_model', header: 'Car Model', value: this.motorRequest.car_model || 'N/A' },
        { field: 'car_year', header: 'Car Year', value: this.motorRequest.car_year || 'N/A' },
        { field: 'car_price', header: 'Car Price', value: this.motorRequest.car_price ? `${this.motorRequest.car_price} LE` : 'N/A' },
        { field: 'start_date', header: 'Start Date', value: this.motorRequest.start_date ? this.formatDate(this.motorRequest.start_date) : 'N/A' },
        { field: 'duration', header: 'Duration', value: this.motorRequest.duration ? `${this.motorRequest.duration} years` : 'N/A' },
        { field: 'end_date', header: 'End Date', value: this.motorRequest.end_date ? this.formatDate(this.motorRequest.end_date) : 'N/A' },
        { field: 'active_status', header: 'Active Status', value: this.motorRequest.active_status || 'N/A', type: 'boolean' },
        { field: 'created_at', header: 'Created At', value: this.motorRequest.created_at ? this.formatDate(this.motorRequest.created_at) :'N/A' },
        { field: 'updated_at', header: 'Updated At', value: this.motorRequest.updated_at ? this.formatDate(this.motorRequest.updated_at) : 'N/A' }
      ];

      if (this.motorRequest.user) {
        this.userData = [
          { field: 'id', header: 'ID', value: this.motorRequest.user.id || 'N/A' },
          { field: 'name', header: 'Name', value: this.motorRequest.user.name || 'N/A' },
          { field: 'email', header: 'Email', value: this.motorRequest.user.email || 'N/A' },
          { field: 'phone', header: 'Phone', value: this.motorRequest.user.phone || 'N/A' },
          { field: 'gender', header: 'Gender', value: this.motorRequest.user.gender || 'N/A' },
          { field: 'birth_date', header: 'Birth Date', value: this.motorRequest.user.birth_date || 'N/A' },
          { field: 'role', header: 'Role', value: this.motorRequest.user.role || 'N/A' },
          { field: 'created_at', header: 'Created At', value: this.motorRequest.user.created_at ? this.formatDate(this.motorRequest.user.created_at) : 'N/A' },
          { field: 'updated_at', header: 'Updated At', value: this.motorRequest.user.updated_at ? this.formatDate(this.motorRequest.user.updated_at) : 'N/A' }
        ];
      }
    }

    if (this.category) {
      this.categoryData = [
        { field: 'id', header: 'ID', value: this.category.id || 'N/A' },
        { field: 'en_title', header: 'English Title', value: this.category.en_title || 'N/A' },
        { field: 'network_link', header: 'Network Link', value: this.category.network_link || 'N/A', type: 'link' },
        { field: 'counter_number', header: 'Counter Number', value: this.category.counter_number || 'N/A' },
        { field: 'created_at', header: 'Created At', value: this.category.created_at ? this.formatDate(this.category.created_at) : 'N/A' }
      ];
    }

    if (this.motorInsurance) {
      this.motorInsuranceData = [
        { field: 'id', header: 'ID', value: this.motorInsurance.id || 'N/A' },
        { field: 'en_title', header: 'English Title', value: this.motorInsurance.en_title || 'N/A' },
        { field: 'company_name', header: 'Company Name', value: this.motorInsurance.company_name || 'N/A' },
        { field: 'year_money', header: 'Yearly Cost', value: this.motorInsurance.year_money || 'N/A' },
        { field: 'created_at', header: 'Created At', value: this.motorInsurance.created_at ? this.formatDate(this.motorInsurance.created_at) : 'N/A' },
        { field: 'updated_at', header: 'Updated At', value: this.motorInsurance.updated_at ? this.formatDate(this.motorInsurance.updated_at) : 'N/A' }
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

  getImageUrl(imagePath: string): string {
    return imagePath || 'assets/placeholder.png';
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}