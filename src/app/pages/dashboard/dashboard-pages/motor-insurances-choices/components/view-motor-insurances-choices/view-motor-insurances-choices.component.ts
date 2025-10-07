import { Component } from '@angular/core';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorInsuranceChoice } from '../../services/motor-insurances-choices.service';

@Component({
  selector: 'app-view-motor-insurances-choices',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-motor-insurances-choices.component.html',
  styleUrl: './view-motor-insurances-choices.component.scss'
})
export class ViewMotorInsurancesChoicesComponent {
  motorInsuranceChoice: MotorInsuranceChoice | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Choice ID', type: 'text' },
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
    { field: 'active_status', header: 'Status', type: 'boolean' },
    { field: 'created_at', header: 'Created At', type: 'date' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        const motorInsuranceChoiceData = data.data;
        if (motorInsuranceChoiceData) {
          this.motorInsuranceChoice = motorInsuranceChoiceData;
        } else {
          console.warn('No motor insurance choice data found in route data');
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load motor insurance choice:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}