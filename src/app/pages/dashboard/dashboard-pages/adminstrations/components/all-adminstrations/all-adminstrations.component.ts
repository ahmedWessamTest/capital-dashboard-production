import {  Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Administration } from '../../services/adminstrations.service';

@Component({
  selector: 'app-all-adminstrations',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-adminstrations.component.html',
  styleUrl: './all-adminstrations.component.scss',
})
export class AllAdminstrationsComponent {
  adminstrations: Administration[] = []; // Populated via CategoriesService

  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'admin_image', header: 'Image', sortable: false, type: 'image' },
    { field: 'en_name', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    { field: 'active_status', header: 'Status', sortable: true, type: 'text',displayFn(item){
      return item.active_status ? "Enabled" : "Disabled"
    } },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.hide('actionsLoader');

    this.route.data.subscribe({

      next: (data) => {
        this.adminstrations = data['adminstration'].data;
        this.adminstrations.forEach((adminstration) => {
          adminstration.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(adminstration.active_status);
        });
        console.log(this.adminstrations)
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load adminstrations', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}
