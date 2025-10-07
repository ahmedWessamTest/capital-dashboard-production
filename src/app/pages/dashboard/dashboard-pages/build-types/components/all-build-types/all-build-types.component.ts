import { Component } from '@angular/core';
import { BuildType } from '../../services/build-types.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { ActivatedRoute } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-all-build-types',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-build-types.component.html',
  styleUrl: './all-build-types.component.scss'
})
export class AllBuildTypesComponent {
 buildTypes: BuildType[] = []; 

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
        this.buildTypes = data['data'].data;
        this.buildTypes.forEach((buildType) => {
          if(buildType.active_status){
            buildType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(buildType.active_status);
          }
        });
        console.log( "build types",this.buildTypes)
        
        console.log(this.buildTypes)
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load build types', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  } 
}
