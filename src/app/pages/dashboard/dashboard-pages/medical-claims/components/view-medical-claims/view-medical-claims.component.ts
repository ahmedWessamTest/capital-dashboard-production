// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { Category } from '../../../categories/services/categories.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ClaimComment } from '../../../../../../core/services/claims/medical-claim.service';
// import { MedicalClaim } from '../../../../../../core/services/users/users.service';
// import { MedicalInsurance } from '../../../medical-requests/services/medical-requests.service';

// interface MedicalClaimCombinedResponse {
//   medicalClaim: MedicalClaim;
//   category: { data: Category };
//   medicalInsurance: { data: MedicalInsurance };
//   comments: { data: ClaimComment[] };
// }

// interface TableRow {
//   field: string;
//   value: any;
// }

// @Component({
//   selector: 'app-medical-claim-view',
//   standalone: true,
//   imports: [CommonModule, TableModule],
//   template: `
//     <div class="p-4 max-w-7xl mx-auto">
//       <!-- Medical Claim Details -->
//       <h2 class="text-2xl font-bold mb-4 text-gray-800">Medical Claim Details</h2>
//       <div class="overflow-x-auto">
//         <p-table [value]="medicalClaimData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
//             </tr>
//           </ng-template>
//           <ng-template pTemplate="body" let-row>
//             <tr>
//               <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
//               <td>{{ row.value }}</td>
//             </tr>
//           </ng-template>
//         </p-table>
//       </div>

//       <!-- User Details -->
//       <h2 class="text-2xl font-bold my-4 text-gray-800">User Details</h2>
//       <div class="overflow-x-auto">
//         <p-table [value]="userData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
//             </tr>
//           </ng-template>
//           <ng-template pTemplate="body" let-row>
//             <tr>
//               <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
//               <td>{{ row.value }}</td>
//             </tr>
//           </ng-template>
//         </p-table>
//       </div>

//       <!-- Category Details -->
//       <h2 class="text-2xl font-bold my-4 text-gray-800">Category Details</h2>
//       <div class="overflow-x-auto">
//         <p-table [value]="categoryData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
//             </tr>
//           </ng-template>
//           <ng-template pTemplate="body" let-row>
//             <tr>
//               <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
//               <td [innerHTML]="row.value"></td>
//             </tr>
//           </ng-template>
//         </p-table>
//       </div>

//       <!-- Medical Insurance Details -->
//       <h2 class="text-2xl font-bold my-4 text-gray-800">Medical Insurance Details</h2>
//       <div class="overflow-x-auto">
//         <p-table [value]="medicalInsuranceData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">Field</th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">Value</th>
//             </tr>
//           </ng-template>
//           <ng-template pTemplate="body" let-row>
//             <tr>
//               <td class="font-bold text-[#4dade0] uppercase">{{ row.field }}</td>
//               <td>{{ row.value }}</td>
//             </tr>
//           </ng-template>
//         </p-table>
//       </div>
//     </div>
//   `,
//   styles: [`
//     :host {
//       display: block;
//       font-family: 'Arial', sans-serif;
//     }
//     .p-datatable {
//       margin-top: 1rem;
//       border-radius: 8px;
//       overflow: hidden;
//     }
//     .p-datatable th, .p-datatable td {
//       padding: 1.25rem 1rem;
//       border: 1px solid #e5e7eb;
//       text-align: left;
//       vertical-align: top;
//     }
//     .p-datatable-striped tr:nth-child(even) {
//       background-color: #f9fafb;
//     }
//     .p-datatable-sm th, .p-datatable-sm td {
//       font-size: 0.875rem;
//     }
//     .overflow-x-auto {
//       max-width: 100%;
//       overflow-x: auto;
//     }
//     @media (max-width: 640px) {
//       .p-datatable th, .p-datatable td {
//         padding: 0.75rem 0.5rem;
//         font-size: 0.75rem;
//       }
//     }
//   `]
// })
// export class ViewMedicalClaimsComponent implements OnInit {
//   medicalClaim: MedicalClaim | null = null;
//   category: Category | null = null;
//   medicalInsurance: MedicalInsurance | null = null;

//   medicalClaimData: TableRow[] = [];
//   userData: TableRow[] = [];
//   categoryData: TableRow[] = [];
//   medicalInsuranceData: TableRow[] = [];

//   constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) {}

// ngOnInit(): void {
//   this.route.data.subscribe((data: any) => {
//     this.medicalClaim = data['data'].medicalClaim.data;
//     this.category = data['data'].category.data;
//     this.medicalInsurance = data['data'].medicalInsurance.data;

//     this.prepareTableData();
//     this.ngxSpinnerService.hide('actionsLoader');
//   });
//       this.ngxSpinnerService.hide('actionsLoader');

// }

//   prepareTableData(): void {
//     if (this.medicalClaim) {
//       this.medicalClaimData = [
//         { field: 'ID', value: this.medicalClaim.id || 'N/A' },
//         { field: 'Claim Number', value: this.medicalClaim.claim_number || 'N/A' },
//         { field: 'Claim Date', value: this.medicalClaim.claim_date ? this.formatDate(this.medicalClaim.claim_date) : 'N/A' },
//         { field: 'Medical Insurance Number', value: this.medicalClaim.medical_insurance_number || 'N/A' },
//         { field: 'Name', value: this.medicalClaim.name || 'N/A' },
//         { field: 'Email', value: this.medicalClaim.email || 'N/A' },
//         { field: 'Phone', value: this.medicalClaim.phone || 'N/A' },
//         { field: 'Birthdate', value: this.medicalClaim.birthdate ? this.formatDate(this.medicalClaim.birthdate) : 'N/A' },
//         { field: 'Gender', value: this.medicalClaim.gender || 'N/A' },
//         { field: 'Description', value: this.medicalClaim.description || 'N/A' },
//         { field: 'Status', value: this.medicalClaim.status || 'N/A' },
//         { field: 'Created At', value: this.medicalClaim['created_at'] ? this.formatDate(this.medicalClaim['created_at']) : 'N/A' },
//         { field: 'Updated At', value: this.medicalClaim['updated_at'] ? this.formatDate(this.medicalClaim['updated_at']) : 'N/A' }
//       ];

//       if (this.medicalClaim['user']) {
//         this.userData = [
//           { field: 'ID', value: this.medicalClaim['user'].id || 'N/A' },
//           { field: 'Name', value: this.medicalClaim['user'].name || 'N/A' },
//           { field: 'Email', value: this.medicalClaim['user'].email || 'N/A' },
//           { field: 'Phone', value: this.medicalClaim['user'].phone || 'N/A' },
//           { field: 'Gender', value: this.medicalClaim['user'].gender || 'N/A' },
//           { field: 'Birth Date', value: this.medicalClaim['user'].birth_date || 'N/A' },
//           { field: 'Role', value: this.medicalClaim['user'].role || 'N/A' },
//           { field: 'Created At', value: this.medicalClaim['user'].created_at ? this.formatDate(this.medicalClaim['user'].created_at) : 'N/A' },
//           { field: 'Updated At', value: this.medicalClaim['user'].updated_at ? this.formatDate(this.medicalClaim['user'].updated_at) : 'N/A' }
//         ];
//       }
//     }

//     if (this.category) {
//       this.categoryData = [
//         { field: 'ID', value: this.category.id || 'N/A' },
//         { field: 'English Title', value: this.category.en_title || 'N/A' },
//         { 
//           field: 'Network Link', 
//           value: this.category.network_link 
//             ? `<a href="${this.category.network_link}" target="_blank" class="text-blue-600 hover:underline">link</a>`
//             : 'N/A'
//         },
//         { field: 'Counter Number', value: this.category.counter_number || 'N/A' },
//         { field: 'Created At', value: this.category.created_at ? this.formatDate(this.category.created_at) : 'N/A' }
//       ];
//     }

//     if (this.medicalInsurance) {
//       this.medicalInsuranceData = [
//         { field: 'ID', value: this.medicalInsurance.id || 'N/A' },
//         { field: 'English Title', value: this.medicalInsurance.en_title || 'N/A' },
//         { field: 'Company Name', value: this.medicalInsurance.company_name || 'N/A' },
//         { field: 'Yearly Cost', value: this.medicalInsurance.year_money || 'N/A' },
//         { field: 'Created At', value: this.medicalInsurance.created_at ? this.formatDate(this.medicalInsurance.created_at) : 'N/A' },
//         { field: 'Updated At', value: this.medicalInsurance.updated_at ? this.formatDate(this.medicalInsurance.updated_at) : 'N/A' }
//       ];
//     }
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return 'N/A';
    
//     if (dateString.includes('T')) {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const day = date.getDate().toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${month}/${day}/${year}`;
//     }
    
//     const match = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
//     if (!match) return dateString;
//     const [, day, month, year] = match;
//     return `${month}/${day}/${year}`;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Category } from '../../../categories/services/categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClaimComment } from '../../../../../../core/services/claims/medical-claim.service';
import { MedicalClaim } from '../../../../../../core/services/users/users.service';
import { MedicalInsurance } from '../../../medical-requests/services/medical-requests.service';

interface MedicalClaimCombinedResponse {
  medicalClaim: { data: MedicalClaim };
  category: { data: Category };
  medicalInsurance: { data: MedicalInsurance } | null; // Allow null
  comments: { data: ClaimComment[] };
}

interface TableRow {
  field: string;
  value: any;
}

@Component({
  selector: 'app-medical-claim-view',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Medical Claim Details -->
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Medical Claim Details</h2>
      <div class="overflow-x-auto">
        <p-table [value]="medicalClaimData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
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

      <!-- Medical Insurance Details -->
      <ng-container *ngIf="medicalInsuranceData.length > 0"> <!-- Conditionally render section -->
        <h2 class="text-2xl font-bold my-4 text-gray-800">Medical Insurance Details</h2>
        <div class="overflow-x-auto">
          <p-table [value]="medicalInsuranceData" [scrollable]="true" scrollHeight="auto" styleClass="p-datatable-striped p-datatable-sm">
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
export class ViewMedicalClaimsComponent implements OnInit {
  medicalClaim: MedicalClaim | null = null;
  category: Category | null = null;
  medicalInsurance: MedicalInsurance | null = null;

  medicalClaimData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  medicalInsuranceData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private ngxSpinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.medicalClaim = data['data'].medicalClaim.data;
      this.category = data['data'].category.data;
      this.medicalInsurance = data['data'].medicalInsurance?.data || null; // Handle null medicalInsurance

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
    });
  }

  prepareTableData(): void {
    if (this.medicalClaim) {
      this.medicalClaimData = [
        { field: 'ID', value: this.medicalClaim.id || 'N/A' },
        { field: 'Claim Number', value: this.medicalClaim.claim_number || 'N/A' },
        { field: 'Claim Date', value: this.medicalClaim.claim_date ? this.formatDate(this.medicalClaim.claim_date) : 'N/A' },
        { field: 'Medical Insurance Number', value: this.medicalClaim.medical_insurance_number || 'N/A' },
        { field: 'Name', value: this.medicalClaim.name || 'N/A' },
        { field: 'Email', value: this.medicalClaim.email || 'N/A' },
        { field: 'Phone', value: this.medicalClaim.phone || 'N/A' },
        { field: 'Birthdate', value: this.medicalClaim.birthdate ? this.formatDate(this.medicalClaim.birthdate) : 'N/A' },
        { field: 'Gender', value: this.medicalClaim.gender || 'N/A' },
        { field: 'Description', value: this.medicalClaim.description || 'N/A' },
        { field: 'Status', value: this.medicalClaim.status || 'N/A' },
        { field: 'Created At', value: this.medicalClaim['created_at'] ? this.formatDate(this.medicalClaim['created_at']) : 'N/A' },
        { field: 'Updated At', value: this.medicalClaim['updated_at'] ? this.formatDate(this.medicalClaim['updated_at']) : 'N/A' }
      ];

      if (this.medicalClaim['user']) {
        this.userData = [
          { field: 'ID', value: this.medicalClaim['user'].id || 'N/A' },
          { field: 'Name', value: this.medicalClaim['user'].name || 'N/A' },
          { field: 'Email', value: this.medicalClaim['user'].email || 'N/A' },
          { field: 'Phone', value: this.medicalClaim['user'].phone || 'N/A' },
          { field: 'Gender', value: this.medicalClaim['user'].gender || 'N/A' },
          { field: 'Birth Date', value: this.medicalClaim['user'].birth_date || 'N/A' },
          { field: 'Role', value: this.medicalClaim['user'].role || 'N/A' },
          { field: 'Created At', value: this.medicalClaim['user'].created_at ? this.formatDate(this.medicalClaim['user'].created_at) : 'N/A' },
          { field: 'Updated At', value: this.medicalClaim['user'].updated_at ? this.formatDate(this.medicalClaim['user'].updated_at) : 'N/A' }
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

    if (this.medicalInsurance) {
      this.medicalInsuranceData = [
        { field: 'ID', value: this.medicalInsurance.id || 'N/A' },
        { field: 'English Title', value: this.medicalInsurance.en_title || 'N/A' },
        { field: 'Company Name', value: this.medicalInsurance.company_name || 'N/A' },
        { field: 'Yearly Cost', value: this.medicalInsurance.year_money || 'N/A' },
        { field: 'Created At', value: this.medicalInsurance.created_at ? this.formatDate(this.medicalInsurance.created_at) : 'N/A' },
        { field: 'Updated At', value: this.medicalInsurance.updated_at ? this.formatDate(this.medicalInsurance.updated_at) : 'N/A' }
      ];
    } else {
      this.medicalInsuranceData = []; // Set to empty array if medicalInsurance is null
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