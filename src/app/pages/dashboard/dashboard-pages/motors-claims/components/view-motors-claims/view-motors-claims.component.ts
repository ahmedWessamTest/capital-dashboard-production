// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { Category } from '../../../categories/services/categories.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ClaimComment, MotorClaim, MotorInsurance } from '../../../../../../core/services/claims/motor-claim.service';

// interface MotorClaimCombinedResponse {
//   motorClaim: { data: MotorClaim };
//   category: { data: Category };
//   motorInsurance: { data: MotorInsurance };
//   comments: { data: ClaimComment[] };
// }

// interface TableRow {
//   field: string;
//   value: any;
// }

// @Component({
//   selector: 'app-motor-claim-view',
//   standalone: true,
//   imports: [CommonModule, TableModule],
//   template: `
//     <div class="p-4 max-w-7xl mx-auto">
//       <!-- Motor Claim Details -->
//       <h2 class="text-2xl font-bold mb-4 text-gray-800">Motor Claim Details</h2>
//       <div class="overflow-x-auto">
//         <p-table
//           [value]="motorClaimData"
//           [scrollable]="true"
//           scrollHeight="auto"
//           styleClass="p-datatable-striped p-datatable-sm"
//         >
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
//                 Field
//               </th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
//                 Value
//               </th>
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
//         <p-table
//           [value]="userData"
//           [scrollable]="true"
//           scrollHeight="auto"
//           styleClass="p-datatable-striped p-datatable-sm"
//         >
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
//                 Field
//               </th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
//                 Value
//               </th>
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
//         <p-table
//           [value]="categoryData"
//           [scrollable]="true"
//           scrollHeight="auto"
//           styleClass="p-datatable-striped p-datatable-sm"
//         >
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
//                 Field
//               </th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
//                 Value
//               </th>
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

//       <!-- Motor Insurance Details -->
//       <h2 class="text-2xl font-bold my-4 text-gray-800">
//         Motor Insurance Details
//       </h2>
//       <div class="overflow-x-auto">
//         <p-table
//           [value]="motorInsuranceData"
//           [scrollable]="true"
//           scrollHeight="auto"
//           styleClass="p-datatable-striped p-datatable-sm"
//         >
//           <ng-template pTemplate="header">
//             <tr>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
//                 Field
//               </th>
//               <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
//                 Value
//               </th>
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
//   styles: [
//     `
//       :host {
//         display: block;
//         font-family: 'Arial', sans-serif;
//       }
//       .p-datatable {
//         margin-top: 1rem;
//         border-radius: 8px;
//         overflow: hidden;
//       }
//       .p-datatable th,
//       .p-datatable td {
//         padding: 1.25rem 1rem;
//         border: 1px solid #e5e7eb;
//         text-align: left;
//         vertical-align: top;
//       }
//       .p-datatable-striped tr:nth-child(even) {
//         background-color: #f9fafb;
//       }
//       .p-datatable-sm th,
//       .p-datatable-sm td {
//         font-size: 0.875rem;
//       }
//       .overflow-x-auto {
//         max-width: 100%;
//         overflow-x: auto;
//       }
//       @media (max-width: 640px) {
//         .p-datatable th,
//         .p-datatable td {
//           padding: 0.75rem 0.5rem;
//           font-size: 0.75rem;
//         }
//       }
//     `,
//   ],
// })
// export class ViewMotorsClaimsComponent implements OnInit {
//   motorClaim: MotorClaim | null = null;
//   category: Category | null = null;
//   motorInsurance: MotorInsurance | null = null;

//   motorClaimData: TableRow[] = [];
//   userData: TableRow[] = [];
//   categoryData: TableRow[] = [];
//   motorInsuranceData: TableRow[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private ngxSpinnerService: NgxSpinnerService
//   ) {}

//   ngOnInit(): void {
//     this.route.data.subscribe((data: any) => {
//       this.motorClaim = data['data'].motorClaim.data;
//       this.category = data['data'].category.data;
//       this.motorInsurance = data['data'].motorInsurance.data;

//       this.prepareTableData();
//       this.ngxSpinnerService.hide('actionsLoader');
//     });
//   }

//   prepareTableData(): void {
//     if (this.motorClaim) {
//       this.motorClaimData = [
//         { field: 'ID', value: this.motorClaim.id || 'N/A' },
//         { field: 'Claim Number', value: this.motorClaim.claim_number || 'N/A' },
//         {
//           field: 'Claim Date',
//           value: this.motorClaim.claim_date
//             ? this.formatDate(this.motorClaim.claim_date)
//             : 'N/A',
//         },
//         {
//           field: 'Motor Insurance Number',
//           value: this.motorClaim.motor_insurance_number || 'N/A',
//         },
//         { field: 'Name', value: this.motorClaim.name || 'N/A' },
//         { field: 'Email', value: this.motorClaim.email || 'N/A' },
//         { field: 'Phone', value: this.motorClaim.phone || 'N/A' },
      
//         { field: 'Car Type', value: this.motorClaim.car_type || 'N/A' },
//         { field: 'Car Brand', value: this.motorClaim.car_brand || 'N/A' },
//         { field: 'Car Model', value: this.motorClaim.car_model || 'N/A' },
//         { field: 'Car Year', value: this.motorClaim.car_year || 'N/A' },
//         { field: 'Car Price', value: this.motorClaim.car_price || 'N/A' },
//         { field: 'Description', value: this.motorClaim.description || 'N/A' },
//         { field: 'Status', value: this.motorClaim.status || 'N/A' },
//         {
//           field: 'Created At',
//           value: this.motorClaim.created_at
//             ? this.formatDate(this.motorClaim.created_at)
//             : 'N/A',
//         },
//         {
//           field: 'Updated At',
//           value: this.motorClaim.updated_at
//             ? this.formatDate(this.motorClaim.updated_at)
//             : 'N/A',
//         },
//       ];

//       if (this.motorClaim.user) {
//         this.userData = [
//           { field: 'ID', value: this.motorClaim.user.id || 'N/A' },
//           { field: 'Name', value: this.motorClaim.user.name || 'N/A' },
//           { field: 'Email', value: this.motorClaim.user.email || 'N/A' },
//           { field: 'Phone', value: this.motorClaim.user.phone || 'N/A' },
//           {
//             field: 'Created At',
//             value: this.motorClaim.user.created_at
//               ? this.formatDate(this.motorClaim.user.created_at)
//               : 'N/A',
//           },
//           {
//             field: 'Updated At',
//             value: this.motorClaim.user.updated_at
//               ? this.formatDate(this.motorClaim.user.updated_at)
//               : 'N/A',
//           },
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
//             : 'N/A',
//         },
//         { field: 'Counter Number', value: this.category.counter_number || 'N/A' },
//         {
//           field: 'Created At',
//           value: this.category.created_at
//             ? this.formatDate(this.category.created_at)
//             : 'N/A',
//         },
//       ];
//     }

//     if (this.motorInsurance) {
//       this.motorInsuranceData = [
//         { field: 'ID', value: this.motorInsurance.id || 'N/A' },
//         { field: 'English Title', value: this.motorInsurance.en_title || 'N/A' },
//         { field: 'Company Name', value: this.motorInsurance.company_name || 'N/A' },
//         { field: 'Yearly Cost', value: this.motorInsurance.year_money || 'N/A' },
//         {
//           field: 'Created At',
//           value: this.motorInsurance.created_at
//             ? this.formatDate(this.motorInsurance.created_at)
//             : 'N/A',
//         },
//         {
//           field: 'Updated At',
//           value: this.motorInsurance.updated_at
//             ? this.formatDate(this.motorInsurance.updated_at)
//             : 'N/A',
//         },
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
import { ClaimComment, MotorClaim, MotorInsurance } from '../../../../../../core/services/claims/motor-claim.service';

interface MotorClaimCombinedResponse {
  motorClaim: { data: MotorClaim };
  category: { data: Category };
  motorInsurance: { data: MotorInsurance } | null; // Allow null
  comments: { data: ClaimComment[] };
}

interface TableRow {
  field: string;
  value: any;
}

@Component({
  selector: 'app-motor-claim-view',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Motor Claim Details -->
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Motor Claim Details</h2>
      <div class="overflow-x-auto">
        <p-table
          [value]="motorClaimData"
          [scrollable]="true"
          scrollHeight="auto"
          styleClass="p-datatable-striped p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
                Field
              </th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
                Value
              </th>
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
        <p-table
          [value]="userData"
          [scrollable]="true"
          scrollHeight="auto"
          styleClass="p-datatable-striped p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
                Field
              </th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
                Value
              </th>
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
        <p-table
          [value]="categoryData"
          [scrollable]="true"
          scrollHeight="auto"
          styleClass="p-datatable-striped p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
                Field
              </th>
              <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
                Value
              </th>
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

      <!-- Motor Insurance Details -->
      <ng-container *ngIf="motorInsuranceData.length > 0"> <!-- Conditionally render section -->
        <h2 class="text-2xl font-bold my-4 text-gray-800">
          Motor Insurance Details
        </h2>
        <div class="overflow-x-auto">
          <p-table
            [value]="motorInsuranceData"
            [scrollable]="true"
            scrollHeight="auto"
            styleClass="p-datatable-striped p-datatable-sm"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="bg-gray-100 text-gray-700 font-semibold min-w-[200px]">
                  Field
                </th>
                <th class="bg-gray-100 text-gray-700 font-semibold min-w-[250px]">
                  Value
                </th>
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
  styles: [
    `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .p-datatable {
        margin-top: 1rem;
        border-radius: 8px;
        overflow: hidden;
      }
      .p-datatable th,
      .p-datatable td {
        padding: 1.25rem 1rem;
        border: 1px solid #e5e7eb;
        text-align: left;
        vertical-align: top;
      }
      .p-datatable-striped tr:nth-child(even) {
        background-color: #f9fafb;
      }
      .p-datatable-sm th,
      .p-datatable-sm td {
        font-size: 0.875rem;
      }
      .overflow-x-auto {
        max-width: 100%;
        overflow-x: auto;
      }
      @media (max-width: 640px) {
        .p-datatable th,
        .p-datatable td {
          padding: 0.75rem 0.5rem;
          font-size: 0.75rem;
        }
      }
    `,
  ],
})
export class ViewMotorsClaimsComponent implements OnInit {
  motorClaim: MotorClaim | null = null;
  category: Category | null = null;
  motorInsurance: MotorInsurance | null = null;

  motorClaimData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  motorInsuranceData: TableRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.motorClaim = data['data'].motorClaim.data;
      this.category = data['data'].category.data;
      this.motorInsurance = data['data'].motorInsurance?.data || null; // Handle null motorInsurance

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
    });
    this.ngxSpinnerService.hide('actionsLoader');

  }

  prepareTableData(): void {
    if (this.motorClaim) {
      this.motorClaimData = [
        { field: 'ID', value: this.motorClaim.id || 'N/A' },
        { field: 'Claim Number', value: this.motorClaim.claim_number || 'N/A' },
        {
          field: 'Claim Date',
          value: this.motorClaim.claim_date
            ? this.formatDate(this.motorClaim.claim_date)
            : 'N/A',
        },
        {
          field: 'Motor Insurance Number',
          value: this.motorClaim.motor_insurance_number || 'N/A',
        },
        { field: 'Name', value: this.motorClaim.name || 'N/A' },
        { field: 'Email', value: this.motorClaim.email || 'N/A' },
        { field: 'Phone', value: this.motorClaim.phone || 'N/A' },
        { field: 'Car Type', value: this.motorClaim.car_type || 'N/A' },
        { field: 'Car Brand', value: this.motorClaim.car_brand || 'N/A' },
        { field: 'Car Model', value: this.motorClaim.car_model || 'N/A' },
        { field: 'Car Year', value: this.motorClaim.car_year || 'N/A' },
        { field: 'Car Price', value: this.motorClaim.car_price || 'N/A' },
        { field: 'Description', value: this.motorClaim.description || 'N/A' },
        { field: 'Status', value: this.motorClaim.status || 'N/A' },
        {
          field: 'Created At',
          value: this.motorClaim.created_at
            ? this.formatDate(this.motorClaim.created_at)
            : 'N/A',
        },
        {
          field: 'Updated At',
          value: this.motorClaim.updated_at
            ? this.formatDate(this.motorClaim.updated_at)
            : 'N/A',
        },
      ];

      if (this.motorClaim.user) {
        this.userData = [
          { field: 'ID', value: this.motorClaim.user.id || 'N/A' },
          { field: 'Name', value: this.motorClaim.user.name || 'N/A' },
          { field: 'Email', value: this.motorClaim.user.email || 'N/A' },
          { field: 'Phone', value: this.motorClaim.user.phone || 'N/A' },
          {
            field: 'Created At',
            value: this.motorClaim.user.created_at
              ? this.formatDate(this.motorClaim.user.created_at)
              : 'N/A',
          },
          {
            field: 'Updated At',
            value: this.motorClaim.user.updated_at
              ? this.formatDate(this.motorClaim.user.updated_at)
              : 'N/A',
          },
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
            : 'N/A',
        },
        { field: 'Counter Number', value: this.category.counter_number || 'N/A' },
        {
          field: 'Created At',
          value: this.category.created_at
            ? this.formatDate(this.category.created_at)
            : 'N/A',
        },
      ];
    }

    if (this.motorInsurance) {
      this.motorInsuranceData = [
        { field: 'ID', value: this.motorInsurance.id || 'N/A' },
        { field: 'English Title', value: this.motorInsurance.en_title || 'N/A' },
        { field: 'Company Name', value: this.motorInsurance.company_name || 'N/A' },
        { field: 'Yearly Cost', value: this.motorInsurance.year_money || 'N/A' },
        {
          field: 'Created At',
          value: this.motorInsurance.created_at
            ? this.formatDate(this.motorInsurance.created_at)
            : 'N/A',
        },
        {
          field: 'Updated At',
          value: this.motorInsurance.updated_at
            ? this.formatDate(this.motorInsurance.updated_at)
            : 'N/A',
        },
      ];
    } else {
      this.motorInsuranceData = []; // Set to empty array if motorInsurance is null
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