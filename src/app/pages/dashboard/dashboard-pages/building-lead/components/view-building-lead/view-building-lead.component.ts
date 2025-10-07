import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { BuildingLead } from '../../services/building-lead.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-view-building-lead',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-building-lead.component.html',
  styleUrl: './view-building-lead.component.scss'
})
export class ViewBuildingLeadComponent {
  buildingLead: BuildingLead | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Building Lead ID ', type: 'text' },
    {
      field: 'category_id', header: 'Category Name', type: 'text', displayFn(item) {
        return item.category?.en_title || "No Category";
      }
    },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'phone', header: 'Phone', type: 'text' },
    {
      field: 'lead_type', header: 'Type', type: 'text', displayFn(item) {
        return item.lead_type || 'individual'
      },
    },
    { field: 'company_address', header: 'Company Address', type: 'text' },
    { field: 'company_building_number', header: 'Company Building Number', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'company_building_total_money', header: 'Total buildings mony', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'need_call', header: 'Need Call', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'building_type_id', header: 'Building Type ID', type: 'text' },
    { field: 'building_type', header: 'Building Type', type: 'text' },
    { field: 'building_country_id', header: 'Building Country ID', type: 'text' },
    { field: 'building_country', header: 'Building Country', type: 'text' },
    { field: 'building_price', header: 'Building Price', type: 'text' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

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
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load buildingLead:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}
