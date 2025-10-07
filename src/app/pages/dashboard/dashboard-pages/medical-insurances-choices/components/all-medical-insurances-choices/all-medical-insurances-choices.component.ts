import { Component } from '@angular/core';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { MedicalInsuranceChoice } from '../../services/medical-insurances-choices.service';

@Component({
  selector: 'app-all-medical-insurances-choices',
  standalone: true,
  imports: [GenericTableComponent,RouterOutlet],
  templateUrl: './all-medical-insurances-choices.component.html',
  styleUrl: './all-medical-insurances-choices.component.scss'
})
export class AllMedicalInsurancesChoicesComponent {
  medicalInsuranceChoices: MedicalInsuranceChoice[] = [];
  medicalInsuranceId: string = '';
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'category_id', header: 'Category', sortable: true, displayFn(item) {
      return item.category?.en_title || 'No Category';
    }},

    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'active_status', header: 'Active Status', sortable: true },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
   
  
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private router:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.medicalInsuranceId = this.router.snapshot.params['id'];
    
    this.route.data.subscribe({
      next: ({ data }) => {
        console.log('Resolver data:', data);
        this.medicalInsuranceChoices = data.data ;
        console.log('Medical Insurance Choices:', this.medicalInsuranceChoices);
        this.ngxSpinnerService.hide('actionsLoader');

      },
      error: (err) => {
        console.error('Failed to load medical insurance choices', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}