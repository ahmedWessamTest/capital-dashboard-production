import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Router } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { finalize, map } from 'rxjs';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { BuildingInsurance, BuildingInsurancesService, BuildingInsurancesListResponse } from '../../services/property-insurance.service';

@Component({
  selector: 'app-all-property-insurances',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-property-insurance.component.html',
  styleUrls: ['./all-property-insurance.component.scss']
})
export class AllPropertyInsuranceComponent implements OnInit {
  buildingInsurances: BuildingInsurance[] = []; 
  isLoading: boolean = true;
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    { 
      field: 'category_id', 
      header: 'Category', 
      sortable: true, 
      displayFn(item) {
        return item.category?.en_title || 'No Category';
      }
    },
    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'year_money', header: 'Year Money', sortable: true },
    { field: 'company_name', header: 'Company Name', sortable: true },
    { 
      field: 'choices', 
      header: 'Choices', 
      sortable: false, 
      choicesProperty: 'buildingchoices', 
      displayFn(item) {
        return item.buildingchoices?.length ? `${item.buildingchoices.length} Choices` : 'No Choices';
      } 
    },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private buildingInsurancesService: BuildingInsurancesService,
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
    this.buildingInsurancesService.getAll().pipe(
      map((response: BuildingInsurancesListResponse) => this.normalizeInsurances(response)),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.buildingInsurances = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load building insurances', err);
        this.isLoading = false;
      }
    });
  }

  private normalizeInsurances(response: BuildingInsurancesListResponse): BuildingInsurancesListResponse {
    if (response?.data) {
      response.data.forEach(insurance => {
        insurance.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(insurance.active_status);
      });
    }
    return response;
  }
}