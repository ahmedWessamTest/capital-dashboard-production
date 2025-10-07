import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, map } from 'rxjs';
import { NormalizeActiveStatusService } from '../../core/normalize-active-status/normalize-active-status.service';
import { DataRefreshService } from '../../core/services/refresh/data-refresh.service';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { LoadingDataBannerComponent } from '../../shared/components/loading-data-banner/loading-data-banner.component';
import { Column } from '../../shared/service/genereic-table.service';
import { GetAllJop, IJopInsurance } from '../res/interface/getAllJop';
import { JopInsurancesService } from '../res/services/jop-insurance.service';

@Component({
  selector: 'app-all-jop-insurances',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-jop-insurance.component.html',
  styleUrl: './all-jop-insurance.component.scss',
})
export class AllJopInsuranceComponent implements OnInit {
  motorInsurances: IJopInsurance[] = [];
  isLoading: boolean = true;
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    {
      field: 'category_id',
      header: 'Category',
      sortable: true,
      displayFn(item) {
        return item.category?.en_title || 'No Category';
      },
    },
    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'year_money', header: 'Year Money', sortable: true },
    { field: 'company_name', header: 'Company Name', sortable: true },
    {
      field: 'choices',
      header: 'Choices',
      sortable: false,
      choicesProperty: 'motorchoices',
      displayFn(item) {
        return item.motorchoices?.length
          ? `${item.motorchoices.length} Choices`
          : 'No Choices';
      },
    },
  ];

  constructor(
    private motorInsurancesService: JopInsurancesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.dataRefreshService.refresh$.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.isLoading = true;
    this.motorInsurancesService
      .getAll()
      .pipe(
        map((response: GetAllJop) => this.normalizeInsurances(response)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response) => {
          this.motorInsurances = response.data;
          console.log(this.motorInsurances);

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load motor insurances', err);
          this.isLoading = false;
        },
      });
  }

  private normalizeInsurances(response: GetAllJop): GetAllJop {
    if (response?.data) {
      response.data.forEach((insurance: any) => {
        insurance.active_status =
          this.normalizeActiveStatusService.normalizeActiveStatus(
            insurance.active_status
          );
      });
    }
    return response;
  }
}
