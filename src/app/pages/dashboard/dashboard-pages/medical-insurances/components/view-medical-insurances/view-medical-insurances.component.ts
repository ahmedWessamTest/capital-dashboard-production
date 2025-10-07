import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { Column } from "../../../../../../shared/service/genereic-table.service";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalInsurance } from '../../services/medical-insurances.service';
@Component({
  selector: 'app-view-medical-insurances',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-medical-insurances.component.html',
  styleUrl: './view-medical-insurances.component.scss'
})
export class ViewMedicalInsurancesComponent {
  medicalInsurance: MedicalInsurance | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Medical Insurance ID ', type: 'text' },
    { field: 'category_id', header: 'Category Name', type: 'text', displayFn(item) {
      return item.category?.en_title || "No Category";
    }},
    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'year_money', header: 'Year Money', type: 'text' },
    { field: 'company_name', header: 'Company Name', type: 'text' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },

    
    
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}  

  ngOnInit(): void {
    console.log('ViewMedicalInsurancesComponent initialized');
    
    this.route.data.subscribe({
      next: ({data}) => {
        console.log('Route data received:', data);
        
        // Handle different response structures
        const medicalInsuranceData = data.data;
        console.log('Medical insurance resolver data:', medicalInsuranceData);
        
        if (medicalInsuranceData) {
          // Check if the response has a 'data' property (API wrapper)
          this.medicalInsurance = medicalInsuranceData;
          console.log('Assigned medical insurance:', this.medicalInsurance);
        } else {
          console.warn('No medical  insurance data found in route data');
        }
        
        // Hide spinner after processing data
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load medicalInsurance:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}
