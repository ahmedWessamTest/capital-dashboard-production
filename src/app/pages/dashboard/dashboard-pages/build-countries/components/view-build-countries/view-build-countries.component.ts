import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { BuildCountry } from '../../services/build-countries.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-build-countries',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-build-countries.component.html',
  styleUrls: ['./view-build-countries.component.scss']
})
export class ViewBuildCountriesComponent implements OnInit, OnDestroy {
  buildCountry: BuildCountry | null = null;
  private dataSubscription: Subscription | null = null;

  columns: Column[] = [
    { field: 'id', header: 'ID', type: 'text' },
    {
      field: 'build_type_id',
      header: 'Build Type',
      type: 'text',
      displayFn: (item) => item.build_type?.en_title || 'No Build Type'
    },
    { field: 'en_title', header: 'English Name', type: 'text' },
    { field: 'ar_title', header: 'Arabic Name', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' }
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.route.data.subscribe({
      next: (data) => {
        console.log(data)
        console.log(data['data']['buildCountry'])
        if (data?.['data']['buildCountry']) {
          this.buildCountry = data['data']['buildCountry'].data;
          if (this.buildCountry) {
            this.buildCountry.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.buildCountry.active_status);
            // Attach build_type from buildTypes
            if (data['data']['buildTypes']) {
              const types = data['data']['buildTypes'].map((type: any) => type.data || type);
              this.buildCountry['build_type'] = types.find((t: any) => t.id === this.buildCountry?.build_type_id);
            }
          }
        }
        console.log('buildCountry:', this.buildCountry); // Debug log
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load build country:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.ngxSpinnerService.hide('actionsLoader');
  }
}