import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalInsuranceChoice } from '../../services/medical-insurances-choices.service';

@Component({
  selector: 'app-view-medical-insurances-choices',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-medical-insurances-choices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewMedicalInsurancesChoicesComponent {
  medicalInsuranceChoice: MedicalInsuranceChoice | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Choice ID', type: 'text' },
    {
      field: 'category_id', header: 'Category Name', type: 'text', displayFn(item) {
        return item.category?.en_title || 'No Category';
      }
    },

    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        const medicalInsuranceChoiceData = data.data;
        if (medicalInsuranceChoiceData) {
          this.medicalInsuranceChoice = medicalInsuranceChoiceData;
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load medical insurance choice:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}