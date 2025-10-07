import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, map } from 'rxjs';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import {
  IAllJopPolicy,
  IJopPolicy,
} from '../../../a-jop-insurance/jop-insurance';
import { JopInsuranceService } from '../../../a-jop-insurance/jop-insurance.service';

@Component({
  selector: 'app-all-jop-insurance',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-jop-insurance.component.html',
  styleUrls: ['./all-jop-insurance.component.scss'],
})
export class AllJopInsuranceComponent implements OnInit {
  jopInsurances: IJopPolicy[] = [];
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
    { field: 'month_money', header: 'Month Money', sortable: true },
    { field: 'company_name', header: 'Company Name', sortable: true },
    {
      field: 'choices',
      header: 'Choices',
      sortable: false,
      choicesProperty: 'jopchoices',
      displayFn(item) {
        return item.jopchoices?.length
          ? `${item.jopchoices.length} Choices`
          : 'No Choices';
      },
    },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private jopInsuranceService: JopInsuranceService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    console.log('call-data-again');
    this.jopInsuranceService
      .getAll()
      .pipe(
        map((response: IAllJopPolicy) => this.normalizeInsurances(response)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response: IAllJopPolicy) => {
          this.jopInsurances = response.data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load job insurances', err);
          this.isLoading = false;
        },
      });
  }

  private normalizeInsurances(response: IAllJopPolicy): IAllJopPolicy {
    if (response?.data) {
      response.data.forEach((insurance: IJopPolicy) => {
        insurance.active_status =
          this.normalizeActiveStatusService.normalizeActiveStatus(
            insurance.active_status
          ) as any;
      });
    }
    return response;
  }
}
