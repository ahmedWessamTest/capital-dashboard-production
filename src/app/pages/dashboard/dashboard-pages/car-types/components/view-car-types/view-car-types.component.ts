import { Component } from '@angular/core';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { CarType } from '../../services/car-types.service';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";

@Component({
  selector: 'app-view-car-types',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-car-types.component.html',
  styleUrl: './view-car-types.component.scss'
})
export class ViewCarTypesComponent {
  carType: CarType | null = null;

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
        this.carType = data['data'].data;
        
        if (this.carType) {
          this.carType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.carType.active_status);
        }
        console.log("form Build Types Page",this.carType)
      },
      error: (err) => {
        console.error('Failed to load build type', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}
