import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from '../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../shared/service/genereic-table.service';
import { MotorInsurance } from '../res/services/jop-insurance.service';

@Component({
  selector: 'app-view-motor-insurances',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-motor-insurance.component.html',
  styleUrl: './view-motor-insurance.component.scss',
})
export class ViewMotorInsuranceComponent {
  motorInsurance: MotorInsurance | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Motor Insurance ID', type: 'text' },
    {
      field: 'category_id',
      header: 'Category Name',
      type: 'text',
      displayFn(item) {
        return item.category?.en_title || 'No Category';
      },
    },
    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'year_money', header: 'Year Money', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        const motorInsuranceData = data.data;
        if (motorInsuranceData) {
          this.motorInsurance = motorInsuranceData;
        } else {
          console.warn('No motor insurance data found in route data');
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load motor insurance:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
