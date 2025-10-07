import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { Administration, AdministrationResponse } from '../../services/adminstrations.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
@Component({
  selector: 'app-view-adminstrations',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-adminstrations.component.html',
  styleUrl: './view-adminstrations.component.scss'
})
export class ViewAdminstrationsComponent {
  adminstration: Administration | null = null;

  columns: Column[] = [
    { field: 'admin_image', header: 'Image', type: 'image' },
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'en_name', header: 'English Name', type: 'text' },
    { field: 'ar_name', header: 'Arabic Name', type: 'text' },
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
        this.adminstration = data['adminstration'].data;
        
        if (this.adminstration) {
          this.adminstration.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.adminstration.active_status);
        }
        console.log("form Adminstrations Page",this.adminstration)
      },
      error: (err) => {
        console.error('Failed to load adminstration', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}
