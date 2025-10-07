import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableModule } from 'primeng/table';
import {
  JobClaim,
  JobClaimsService,
  JobInsurance,
} from '../../../../../../core/services/claims/jop-claim.service';
import { Category } from '../../../categories/services/categories.service';

interface TableRow {
  field: string;
  value: any;
}

@Component({
  selector: 'app-view-jop-claims',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './view-jop-claims.component.html',
  styleUrl: './view-jop-claims.component.scss',
})
export class ViewJopClaimsComponent implements OnInit {
  jobClaim: JobClaim | null = null;
  category: Category | null = null;
  jobInsurance: JobInsurance | null = null;

  jobClaimData: TableRow[] = [];
  userData: TableRow[] = [];
  categoryData: TableRow[] = [];
  jobInsuranceData: TableRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private jobClaimsService: JobClaimsService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.jobClaim = data['data'].jobClaim?.data || null;
      this.category = data['data'].category?.data || null;
      this.jobInsurance = data['data'].jobInsurance?.data || null;

      this.prepareTableData();
      this.ngxSpinnerService.hide('actionsLoader');
    });
    this.ngxSpinnerService.hide('actionsLoader');
  }

  prepareTableData(): void {
    if (this.jobClaim) {
      this.jobClaimData = [
        { field: 'ID', value: this.jobClaim.id || 'N/A' },
        { field: 'Claim Number', value: this.jobClaim.claim_number || 'N/A' },
        {
          field: 'Claim Date',
          value: this.jobClaim.claim_date
            ? this.formatDate(this.jobClaim.claim_date)
            : 'N/A',
        },
        {
          field: 'Professional Insurance Number',
          value: this.jobClaim.jop_insurance_number || 'N/A',
        },
        { field: 'Name', value: this.jobClaim.name || 'N/A' },
        { field: 'Email', value: this.jobClaim.email || 'N/A' },
        { field: 'Phone', value: this.jobClaim.phone || 'N/A' },
        { field: 'Birth Date', value: this.jobClaim.birthdate || 'N/A' },
        { field: 'Gender', value: this.jobClaim.gender || 'N/A' },
        {
          field: 'Professional Title',
          value: this.jobClaim.job_title || 'N/A',
        },
        { field: 'Company Name', value: this.jobClaim.company_name || 'N/A' },
        {
          field: 'Years of Experience',
          value: this.jobClaim.years_of_experience || 'N/A',
        },
        {
          field: 'Profession Name',
          value: this.jobClaim.profession_name || 'N/A',
        },
        { field: 'Salary', value: this.jobClaim.salary || 'N/A' },
        { field: 'Description', value: this.jobClaim.description || 'N/A' },
        { field: 'Status', value: this.jobClaim.status || 'N/A' },
        {
          field: 'Created At',
          value: this.jobClaim.created_at
            ? this.formatDate(this.jobClaim.created_at)
            : 'N/A',
        },
        {
          field: 'Updated At',
          value: this.jobClaim.updated_at
            ? this.formatDate(this.jobClaim.updated_at)
            : 'N/A',
        },
      ];

      if (this.jobClaim.user) {
        this.userData = [
          { field: 'ID', value: this.jobClaim.user.id || 'N/A' },
          { field: 'Name', value: this.jobClaim.user.name || 'N/A' },
          { field: 'Email', value: this.jobClaim.user.email || 'N/A' },
          { field: 'Phone', value: this.jobClaim.user.phone || 'N/A' },
          {
            field: 'Created At',
            value: this.jobClaim.user.created_at
              ? this.formatDate(this.jobClaim.user.created_at)
              : 'N/A',
          },
          {
            field: 'Updated At',
            value: this.jobClaim.user.updated_at
              ? this.formatDate(this.jobClaim.user.updated_at)
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
        {
          field: 'Counter Number',
          value: this.category.counter_number || 'N/A',
        },
        {
          field: 'Created At',
          value: this.category.created_at
            ? this.formatDate(this.category.created_at)
            : 'N/A',
        },
      ];
    }

    if (this.jobInsurance) {
      this.jobInsuranceData = [
        { field: 'ID', value: this.jobInsurance.id || 'N/A' },
        {
          field: 'English Title',
          value: this.jobInsurance.en_title || 'N/A',
        },
        {
          field: 'Company Name',
          value: this.jobInsurance.company_name || 'N/A',
        },
        {
          field: 'Yearly Cost',
          value: this.jobInsurance.year_money || 'N/A',
        },
        {
          field: 'Monthly Cost',
          value: this.jobInsurance.month_money || 'N/A',
        },
        {
          field: 'Created At',
          value: this.jobInsurance.created_at
            ? this.formatDate(this.jobInsurance.created_at)
            : 'N/A',
        },
        {
          field: 'Updated At',
          value: this.jobInsurance.updated_at
            ? this.formatDate(this.jobInsurance.updated_at)
            : 'N/A',
        },
      ];
    } else {
      this.jobInsuranceData = []; // Set to empty array if jobInsurance is null
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
