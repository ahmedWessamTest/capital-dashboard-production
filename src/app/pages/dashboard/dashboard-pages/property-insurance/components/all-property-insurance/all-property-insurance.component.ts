import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { BuildingInsurance, BuildingInsurancesService, BuildingInsurancesListResponse } from '../../services/property-insurance.service';

@Component({
  selector: 'app-all-property-insurances',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-property-insurance.component.html',
})
export class AllPropertyInsuranceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  buildingInsurances = signal<BuildingInsurance[]>([]);
  isLoading = signal<boolean>(true);
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
    private buildingInsurancesService: BuildingInsurancesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.buildingInsurancesService.getAll().pipe(
      takeUntil(this.destroy$),
      map((response: BuildingInsurancesListResponse) => this.normalizeInsurances(response)),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.buildingInsurances.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load building insurances', err);
        this.isLoading.set(false);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}