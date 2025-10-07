import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Feature } from '../../services/features.service';

@Component({
  selector: 'app-view-features',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-features.component.html',
  styleUrl: './view-features.component.scss'
})
export class ViewFeaturesComponent {
 feature: Feature | null = null;

  columns: Column[] = [
    { field: 'icon_image', header: 'Icon Image', type: 'image' },
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'en_title', header: 'English Name', type: 'text' },
    { field: 'ar_title', header: 'Arabic Name', type: 'text' },
    { field: 'en_description', header: 'English Description', type: 'text' },
    { field: 'ar_description', header: 'Arabic Description', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        console.log(data)
        this.feature = data['feature'].data;
        if(this.feature){
          this.feature.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.feature.active_status);
        }
        console.log("form Features Page",this.feature)
      },
      error: (err) => {
        console.error('Failed to load feature', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}
