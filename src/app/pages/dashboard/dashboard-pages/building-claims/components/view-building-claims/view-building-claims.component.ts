import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingClaim, BuildingInsurance } from '../../../../../../core/services/claims/building-claim.service';
import { ClaimComment } from '../../../../../../core/services/claims/medical-claim.service';
import { Category } from '../../../categories/services/categories.service';

interface BuildingClaimCombinedResponse {
  buildingClaim: { data: BuildingClaim };
  category: { data: Category };
  buildingInsurance: { data: BuildingInsurance } | null; // Allow null
  comments?: { data: ClaimComment[] };
}

interface TableRow {
  field: string;
  value: any;
}

@Component({
  selector: 'app-building-claim-view',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Building Claim Details -->
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Building Claim Details</h2>
      <div class="overflow-x-auto">
        <p-table [value]="buildingClaimData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- User Details -->
      <h2 class="text-2xl font-bold my-4 text-gray-800">User Details</h2>
      <div class="overflow-x-auto">
        <p-table [value]="userData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Category Details -->
      <h2 class="text-2xl font-bold my-4 text-gray-800">Category Details</h2>
      <div class="overflow-x-auto">
        <p-table [value]="categoryData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
              <td [innerHTML]="row.value"></td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Building Insurance Details -->
      <ng-container *ngIf="buildingInsuranceData.length > 0"> <!-- Conditionally render section -->
        <h2 class="text-2xl font-bold my-4 text-gray-800">Building Insurance Details</h2>
        <div class="overflow-x-auto">
          <p-table [value]="buildingInsuranceData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
                <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
                <td>{{ row.value }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
    }
    .p-datatable {
      margin-top: 1rem;
      border-radius: 8px;
      overflow: hidden;
    }
    .p-datatable th, .p-datatable td {
      padding: 1.25rem 1rem;
      border: 1px solid #e5e7eb;
      text-align: left;
      vertical-align: top;
    }
    .p-datatable-striped tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .p-datatable-sm th, .p-datatable-sm td {
      font-size: 0.875rem;
    }
    .overflow-x-auto {
      max-width: 100%;
      overflow-x: auto;
    }
    @media (max-width: 640px) {
      .p-datatable th, .p-datatable td {
        padding: 0.75rem 0.5rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class ViewBuildingClaimsComponent implements OnInit {
  buildingClaim: BuildingClaim | null = null;
  category: Category | null = null;
  buildingInsurance: BuildingInsurance | null = null;

  buildingClaimData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  buildingInsuranceData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.buildingClaim = data['data'].buildingClaim.data;
      this.category = data['data'].category.data;
      this.buildingInsurance = data['data'].buildingInsurance?.data || null; // Handle null buildingInsurance

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
    });
    this.ngxSpinnerService.hide('actionsLoader');

  }

  prepareTableData(): void {
    if (this.buildingClaim) {
      this.buildingClaimData = [
        { field: 'ID', value: this.buildingClaim.id || 'N/A' },
        { field: 'Claim Number', value: this.buildingClaim.claim_number || 'N/A' },
        { field: 'Claim Date', value: this.buildingClaim.claim_date ? this.formatDate(this.buildingClaim.claim_date) : 'N/A' },
        { field: 'Building Insurance Number', value: this.buildingClaim.building_insurance_number || 'N/A' },
        { field: 'Name', value: this.buildingClaim.name || 'N/A' },
        { field: 'Email', value: this.buildingClaim.email || 'N/A' },
        { field: 'Phone', value: this.buildingClaim.phone || 'N/A' },
        { field: 'Building Type', value: this.buildingClaim.building_type || 'N/A' },
        { field: 'Building Country', value: this.buildingClaim.building_country || 'N/A' },
        { field: 'Building Price', value: this.buildingClaim.building_price || 'N/A' },
        { field: 'Description', value: this.buildingClaim.description || 'N/A' },
        { field: 'Status', value: this.buildingClaim.status || 'N/A' },
        { field: 'Created At', value: this.buildingClaim.created_at ? this.formatDate(this.buildingClaim.created_at) : 'N/A' },
        { field: 'Updated At', value: this.buildingClaim.updated_at ? this.formatDate(this.buildingClaim.updated_at) : 'N/A' }
      ];

      if (this.buildingClaim.user) {
        this.userData = [
          { field: 'ID', value: this.buildingClaim.user.id || 'N/A' },
          { field: 'Name', value: this.buildingClaim.user.name || 'N/A' },
          { field: 'Email', value: this.buildingClaim.user.email || 'N/A' },
          { field: 'Phone', value: this.buildingClaim.user.phone || 'N/A' },
          { field: 'Role', value: this.buildingClaim.user.role || 'N/A' },
          { field: 'Created At', value: this.buildingClaim.user.created_at ? this.formatDate(this.buildingClaim.user.created_at) : 'N/A' },
          { field: 'Updated At', value: this.buildingClaim.user.updated_at ? this.formatDate(this.buildingClaim.user.updated_at) : 'N/A' }
        ];
      }
    }

    if (this.category) {
      this.categoryData = [
        { field: 'ID', value: this.category.id || 'N/A' },
        { field: 'English Title', value: this.category.en_title || 'N/A' },
        { 
          field: 'Network Link', 
          value: this.category.network_link 
            ? `<a href="${this.category.network_link}" target="_blank" class="text-blue-600 hover:underline">link</a>`
            : 'N/A'
        },
        { field: 'Counter Number', value: this.category.counter_number || 'N/A' },
        { field: 'Created At', value: this.category.created_at ? this.formatDate(this.category.created_at) : 'N/A' }
      ];
    }

    if (this.buildingInsurance) {
      this.buildingInsuranceData = [
        { field: 'ID', value: this.buildingInsurance.id || 'N/A' },
        { field: 'English Title', value: this.buildingInsurance.en_title || 'N/A' },
        { field: 'Company Name', value: this.buildingInsurance.company_name || 'N/A' },
        { field: 'Yearly Cost', value: this.buildingInsurance.year_money || 'N/A' },
        { field: 'Created At', value: this.buildingInsurance.created_at ? this.formatDate(this.buildingInsurance.created_at) : 'N/A' },
        { field: 'Updated At', value: this.buildingInsurance.updated_at ? this.formatDate(this.buildingInsurance.updated_at) : 'N/A' }
      ];
    } else {
      this.buildingInsuranceData = []; // Set to empty array if buildingInsurance is null
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