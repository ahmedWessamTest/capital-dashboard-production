import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from '../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../shared/service/genereic-table.service';
import { JopLead } from '../res/services/jop-lead.service';
@Component({
  selector: 'app-view-jop-lead',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-jop-lead.component.html',
  styleUrl: './view-jop-lead.component.scss',
})
export class ViewJopLeadComponent {
  buildingLead: JopLead | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Jop Lead ID ', type: 'text' },
    {
      field: 'category_id',
      header: 'Category Name',
      type: 'text',
      displayFn(item) {
        return item.category?.en_title || 'No Category';
      },
    },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'phone', header: 'Phone', type: 'text' },
    {
      field: 'lead_type', header: 'Type', type: 'text', displayFn(item) {
        console.log(item);

        return item.lead_type || 'individual'
      },
    },
    { field: 'company_address', header: 'Company Address', type: 'text' },
    { field: 'company_employee_avg', header: 'Average Age Of Employees', type: 'text' },
    { field: 'company_employee_number', header: 'Number Of Employees', type: 'text' },
    { field: 'company_employee_total_money', header: 'Employee Total Money', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'need_call', header: 'Need Call', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'jop_title', header: 'Jop Title', type: 'text' },
    { field: 'jop_price', header: 'Jop Price', type: 'text' },
    { field: 'jop_main_id', header: 'Jop Main ID', type: 'text' },
    { field: 'jop_second_id', header: 'Jop Second ID', type: 'text' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    console.log('ViewBuildingLeadComponent initialized');

    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);

        // Handle different response structures
        const buildingLeadData = data['data'];
        console.log('Building lead resolver data:', buildingLeadData);

        if (buildingLeadData) {
          // Check if the response has a 'data' property (API wrapper)
          this.buildingLead = buildingLeadData.data || buildingLeadData;
          console.log('Assigned building lead:', this.buildingLead);
        } else {
          console.warn('No building lead data found in route data');
        }

        // Hide spinner after processing data
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load buildingLead:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
