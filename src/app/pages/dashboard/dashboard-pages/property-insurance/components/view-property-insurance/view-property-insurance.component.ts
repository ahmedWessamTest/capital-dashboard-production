import { Component, OnInit } from '@angular/core';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingInsurance } from '../../services/property-insurance.service';

@Component({
  selector: 'app-view-property-insurance',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-property-insurance.component.html',
  styleUrls: ['./view-property-insurance.component.scss']
})
export class ViewPropertyInsuranceComponent implements OnInit {
  propertyInsurance: BuildingInsurance | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Property Insurance ID', type: 'text' },
    { 
      field: 'category_id', 
      header: 'Category Name', 
      type: 'text', 
      displayFn(item) {
        return item.category?.en_title || 'No Category';
      }
    },
    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'year_money', header: 'Year Money', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' }
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        const propertyInsuranceData = data.data;
        if (propertyInsuranceData) {
          this.propertyInsurance = propertyInsuranceData;
        } else {
          console.warn('No property insurance data found in route data');
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load property insurance:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}