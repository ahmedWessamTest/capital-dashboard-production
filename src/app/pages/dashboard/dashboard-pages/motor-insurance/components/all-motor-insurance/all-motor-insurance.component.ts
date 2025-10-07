import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Router } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { filter, finalize, map } from 'rxjs';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { MotorInsurance, MotorInsurancesService, MotorInsurancesListResponse } from '../../services/motor-insurance.service';

@Component({
  selector: 'app-all-motor-insurances',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-motor-insurance.component.html',
  styleUrl: './all-motor-insurance.component.scss'
})
export class AllMotorInsuranceComponent implements OnInit {
  motorInsurances: MotorInsurance[] = [];
  isLoading: boolean = true;
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    { 
      field: 'category_id', 
      header: 'Category', 
      sortable: true, 
      displayFn(item) {
        return item.category?.en_title || "No Category";
      }
    },
    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'year_money', header: 'Year Money', sortable: true },
    { field: 'company_name', header: 'Company Name', sortable: true },
    { 
      field: "choices", 
      header: "Choices", 
      sortable: false, 
      choicesProperty: "motorchoices", 
      displayFn(item) {
        return item.motorchoices?.length ? `${item.motorchoices.length} Choices` : "No Choices";
      } 
    },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private motorInsurancesService: MotorInsurancesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.dataRefreshService.refresh$.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.isLoading = true;
    this.motorInsurancesService.getAll().pipe(
      map((response: MotorInsurancesListResponse) => this.normalizeInsurances(response)),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.motorInsurances = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load motor insurances', err);
        this.isLoading = false;
      }
    });
  }

  private normalizeInsurances(response: MotorInsurancesListResponse): MotorInsurancesListResponse {
    if (response?.data) {
      response.data.forEach(insurance => {
        insurance.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(insurance.active_status);
      });
    }
    return response;
  }
}