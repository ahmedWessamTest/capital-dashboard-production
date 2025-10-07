import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { MotorLead } from '../../services/motors-lead.service';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';

@Component({
  selector: 'app-view-motors-lead',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-motors-lead.component.html',
  styleUrl: './view-motors-lead.component.scss'
})
export class ViewMotorsLeadComponent {
motorLead: MotorLead | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Motor Lead ID ', type: 'text' },
    { field: 'category_id', header: 'Category Name', type: 'text', displayFn(item) {
      return item.category?.en_title || "No Category";
    }},
    { field: 'name', header: 'Name', type: 'text' },

    { field: 'phone', header: 'Phone', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'need_call', header: 'Need Call', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'car_type_id', header: 'Car Type ID', type: 'text' },
    { field: 'car_type', header: 'Car Type', type: 'text' },
    { field: 'car_brand_id', header: 'Car Brand ID', type: 'text' },
    { field: 'car_brand', header: 'Car Brand', type: 'text' },
    { field: 'car_model_id', header: 'Car Model ID', type: 'text' },
    { field: 'car_model', header: 'Car Model', type: 'text' },
    { field: 'car_year_id', header: 'Car Year ID', type: 'text' },
    { field: 'car_year', header: 'Car Year', type: 'text' },
    { field: 'car_price', header: 'Car Price', type: 'text' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    console.log('ViewMotorsLeadComponent initialized');
    
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);
        
        // Handle different response structures
        const motorLeadData = data['data'];
        console.log('Motor lead resolver data:', motorLeadData);
        
        if (motorLeadData) {
          // Check if the response has a 'data' property (API wrapper)
          this.motorLead = motorLeadData.data || motorLeadData;
          console.log('Assigned motor lead:', this.motorLead);
        } else {
          console.warn('No motor lead data found in route data');
        }
        
        // Hide spinner after processing data
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load motorLead:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}
