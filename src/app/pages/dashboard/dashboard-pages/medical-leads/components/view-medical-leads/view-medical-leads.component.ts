import { Component, OnInit } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { MedicalLead } from '../../services/medical-leads.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-view-medical-leads',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-medical-leads.component.html',
  styleUrl: './view-medical-leads.component.scss'
})
export class ViewMedicalLeadsComponent implements OnInit {
  medicalLead: MedicalLead | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Medical Lead ID ', type: 'text' },
    {
      field: 'category_id', header: 'Category Name', type: 'text', displayFn(item) {
        return item.category?.en_title || "No Category";
      }
    },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'gender', header: 'Gender', type: 'text' },
    { field: 'birth_date', header: 'Birth Date', type: 'text' },
    { field: 'phone', header: 'Phone', type: 'text' },
    {
      field: 'lead_type', header: 'Type', type: 'text', displayFn(item) {
        return item.lead_type || 'individual'
      },
    },
    { field: 'company_address', header: 'Company Address', type: 'text' },
    { field: 'company_employee_avg', header: 'Average Age Of Employees', type: 'text' },
    { field: 'company_employee_number', header: 'Number Of Employees', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'need_call', header: 'Need Call', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },



  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    console.log('ViewMedicalLeadsComponent initialized');

    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);

        // Handle different response structures
        const medicalLeadData = data['medicalLead'];
        console.log('Medical lead resolver data:', medicalLeadData);

        if (medicalLeadData) {
          // Check if the response has a 'data' property (API wrapper)
          this.medicalLead = medicalLeadData.data || medicalLeadData;
          console.log('Assigned medical lead:', this.medicalLead);
        } else {
          console.warn('No medical lead data found in route data');
        }

        // Hide spinner after processing data
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load medicalLead:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}
