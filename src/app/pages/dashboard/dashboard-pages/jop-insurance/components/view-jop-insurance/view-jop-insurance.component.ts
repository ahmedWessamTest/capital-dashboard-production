import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { IJopPolicy } from '../../../a-jop-insurance/jop-insurance';

@Component({
  selector: 'app-view-jop-insurance',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-jop-insurance.component.html',
  styleUrls: ['./view-jop-insurance.component.scss'],
})
export class ViewJopInsuranceComponent implements OnInit {
  jopInsurance: IJopPolicy | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Professional Insurance ID', type: 'text' },
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
    { field: 'month_money', header: 'Month Money', type: 'text' },
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
        console.log('data', data);
        const jopInsuranceData = data.data.data;
        if (jopInsuranceData) {
          this.jopInsurance = jopInsuranceData;
        } else {
          console.warn('No job insurance data found in route data');
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load job insurance:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
