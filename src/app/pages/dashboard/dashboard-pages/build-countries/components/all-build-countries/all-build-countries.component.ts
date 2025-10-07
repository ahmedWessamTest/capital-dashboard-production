import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { BuildCountry } from '../../services/build-countries.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { ActivatedRoute } from '@angular/router';
import { BuildType } from '../../../build-types/services/build-types.service';


interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-all-build-countries',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-build-countries.component.html',
  styleUrl: './all-build-countries.component.scss'
})
export class AllBuildCountriesComponent {
  buildCountries: BuildCountry[] = [];
  BuildTypes: BuildType[] = [] // Populated via CategoriesService
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    {
      field: 'build_type_id', header: 'Build Type', sortable: false, displayFn(item) {
        return item.build_type?.en_title || "No Build Type";
      }
    },
    { field: 'en_title', header: 'English Title', sortable: false },
    {
      field: 'active_status', header: 'Active Status', sortable: false, type: 'text', displayFn(item) {
        return item.active_status ? 'Enabled' : 'Disabled';
      }
    },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) { }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.buildCountries = data.buildCountries;
        this.BuildTypes = data.buildTypes;
        this.BuildTypes.forEach((buildType) => {
          buildType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(buildType.active_status);
        })
        this.BuildTypes=this.BuildTypes.filter((buildType) => buildType.active_status === true);
        
      },
      error: (err) => {
        console.error('Failed to load buildCountries', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
      }
    });
    this.ngxSpinnerService.hide('actionsLoader');

  }

  get categoryOptions(): SelectOption[] {
    return this.BuildTypes.map(c => ({
      label: c.en_title,
      value: c.id.toString()
    }));
  }
}
