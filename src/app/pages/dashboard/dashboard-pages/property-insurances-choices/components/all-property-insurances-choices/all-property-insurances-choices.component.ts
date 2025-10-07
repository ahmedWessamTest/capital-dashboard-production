import { Component, OnInit, OnDestroy } from '@angular/core';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { catchError, map, tap, throwError, finalize, debounceTime } from 'rxjs';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { Subscription } from 'rxjs';
import { BuildingInsuranceChoice, BuildingInsuranceChoicesService } from '../../services/property-insurances-choices.service';

@Component({
  selector: 'app-all-property-insurance-choices',
  standalone: true,
  imports: [GenericTableComponent, RouterOutlet, LoadingDataBannerComponent],
  templateUrl: './all-property-insurances-choices.component.html',
  styleUrls: ['./all-property-insurances-choices.component.scss']
})
export class AllPropertyInsurancesChoicesComponent implements OnInit, OnDestroy {
  buildingInsuranceChoices: BuildingInsuranceChoice[] = [];
  buildingInsuranceId: string = '';
  isLoading: boolean = true;
  private refreshSubscription: Subscription | null = null;

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
    { field: 'active_status', header: 'Active Status', sortable: true },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' }
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private buildingInsuranceChoicesService: BuildingInsuranceChoicesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService
  ) {}

  ngOnInit(): void {
    this.buildingInsuranceId = this.route.snapshot.params['id'];
    this.refreshSubscription = this.dataRefreshService.refresh$.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.isLoading = true;
      this.ngxSpinnerService.show('actionsLoader');
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.ngxSpinnerService.show('actionsLoader');
    this.buildingInsuranceChoicesService.getAll().pipe(
      tap((response) => console.log('All building insurance choices request initiated', response)),
      map((response) => {
        if (!response?.data) {
          console.warn('No data in response');
          return response;
        }
        response.data = response.data.filter(choice => choice.building_insurance_id === +this.buildingInsuranceId!);
        response.data.forEach((choice) => {
          choice.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(choice.active_status);
        });
        return response;
      }),
      catchError(err => {
        console.error('Error in loadData:', err);
        this.isLoading = false;
        this.ngxSpinnerService.hide('actionsLoader');
        return throwError(() => err);
      }),
      finalize(() => {
        this.isLoading = false;
        this.ngxSpinnerService.hide('actionsLoader');
      })
    ).subscribe({
      next: (response) => {
        this.buildingInsuranceChoices = [...response.data];
      },
      error: (err) => {
        console.error('Failed to load building insurance choices', err);
        this.isLoading = false;
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}