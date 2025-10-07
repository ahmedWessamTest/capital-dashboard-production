import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Router } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { MedicalInsurance, MedicalInsurancesService, MedicalInsurancesListResponse } from '../../services/medical-insurances.service';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";

@Component({
  selector: 'app-all-medical-insurances',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-medical-insurances.component.html',
  styleUrl: './all-medical-insurances.component.scss'
})
export class AllMedicalInsurancesComponent implements OnInit,OnDestroy {
  private readonly destroy$ = new Subject<void>();
  medicalInsurances: MedicalInsurance[] = [];
  isLoading: boolean = true;
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    {
      field: 'category_id', header: 'Category', sortable: true, displayFn(item) {
        return item.category?.en_title || "No Category";
      }
    },
    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'year_money', header: 'Year Money', sortable: true },
    { field: 'company_name', header: 'Company Name', sortable: true },
    { field: 'active_status', header: 'Status', sortable: true, type: 'text',displayFn(item) {
      console.log(item.active_status);
            
      return item.active_status ? "Enabled":"Disabled"
    } },
    {
      field: "choices",
      header: "Choices",
      sortable: false,
      choicesProperty: "medicalchoices",
      displayFn(item) {
        return item.medicalchoices?.length ? `${item.medicalchoices.length} Choices` : "No Choices";
      }
    },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private medicalInsurancesService: MedicalInsurancesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
    // this.dataRefreshService.refresh$.subscribe(()=>this.loadData())


  }


  private loadData(): void {
    this.isLoading = true,
      console.log('call-data-again')
    // this.ngxSpinnerService.show('actionsLoader');
    this.medicalInsurancesService.getAll().pipe(
      map((response: MedicalInsurancesListResponse) => this.normalizeInsurances(response)),
      finalize(() => this.isLoading = false)
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.medicalInsurances = response.data;
        console.log("medical data:", this.medicalInsurances);

        this.isLoading = false;

      },
      error: (err) => {
        console.error('Failed to load medical insurances', err);
        this.isLoading = false;

      }
    });
  }

  private normalizeInsurances(response: MedicalInsurancesListResponse): MedicalInsurancesListResponse {
    if (response?.data) {
      response.data.forEach(insurance => {
        insurance.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(insurance.active_status);
      });
    }
    return response;
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete()
  }
}
