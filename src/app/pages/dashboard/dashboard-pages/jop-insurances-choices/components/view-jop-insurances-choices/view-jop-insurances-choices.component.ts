import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { JopInsuranceChoice } from '../../services/jop-insurances-choices.service';

@Component({
  selector: 'app-view-jop-insurance-choices',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-jop-insurances-choices.component.html',
  styleUrls: ['./view-jop-insurances-choices.component.scss'],
})
export class ViewJopInsurancesChoicesComponent implements OnInit {
  jopInsuranceChoice: JopInsuranceChoice | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Choice ID', type: 'text' },
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
        const jopInsuranceChoiceData = data.data;
        if (jopInsuranceChoiceData) {
          this.jopInsuranceChoice = jopInsuranceChoiceData;
        } else {
          console.warn('No job insurance choice data found in route data');
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load job insurance choice:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
