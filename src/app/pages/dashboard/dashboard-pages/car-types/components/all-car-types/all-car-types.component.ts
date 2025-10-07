import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { CarType } from '../../services/car-types.service';

@Component({
  selector: 'app-all-car-types',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-car-types.component.html',
  styleUrl: './all-car-types.component.scss'
})
export class AllCarTypesComponent {
  carTypes: CarType[] = []; 

  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'en_title', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
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
        this.carTypes = data['data'].data;
        this.carTypes.forEach((carType) => {
          if(carType.active_status){
            carType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(carType.active_status);
          }
        });
        console.log( "car types",this.carTypes)
        
        console.log(this.carTypes)
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load car types', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  } 
}
