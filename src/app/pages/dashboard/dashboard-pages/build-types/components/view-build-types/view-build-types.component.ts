import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { BuildType } from '../../services/build-types.service';

@Component({
  selector: 'app-view-build-types',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-build-types.component.html',
  styleUrl: './view-build-types.component.scss'
})
export class ViewBuildTypesComponent {
  buildType: BuildType | null = null;

  columns: Column[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'en_title', header: 'English Name', type: 'text' },
    { field: 'ar_title', header: 'Arabic Name', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'date' },
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
        this.buildType = data['data'].data;
        
        if (this.buildType) {
          this.buildType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.buildType.active_status);
        }
        console.log("form Build Types Page",this.buildType)
      },
      error: (err) => {
        console.error('Failed to load build type', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}
