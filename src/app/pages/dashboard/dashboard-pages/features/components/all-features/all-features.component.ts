import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Feature, FeaturesService, FeaturesListResponse } from '../../services/features.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-all-features',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-features.component.html',
  styleUrls: ['./all-features.component.scss']
})
export class AllFeaturesComponent implements OnInit {
  features: Feature[] = [];
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'en_description', header: 'Description', sortable: true, type: 'text', maxLength: 50 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private featuresService: FeaturesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show('actionsLoader');
    this.featuresService.getAll().subscribe({
      next: (response: FeaturesListResponse) => {
        this.features = response.data || [];
        this.features.forEach((feature) => {
          feature.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(feature.active_status);
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load features:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}