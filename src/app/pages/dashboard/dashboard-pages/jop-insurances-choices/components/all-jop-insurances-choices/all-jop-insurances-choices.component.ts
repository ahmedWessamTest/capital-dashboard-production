import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  catchError,
  debounceTime,
  finalize,
  map,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { DataRefreshService } from '../../../../../../core/services/refresh/data-refresh.service';
import { GenericTableComponent } from '../../../../../../shared/components/generic-table/generic-table.component';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import {
  JopInsuranceChoice,
  JopInsuranceChoicesService,
} from '../../services/jop-insurances-choices.service';

@Component({
  selector: 'app-all-jop-insurance-choices',
  standalone: true,
  imports: [GenericTableComponent, LoadingDataBannerComponent],
  templateUrl: './all-jop-insurances-choices.component.html',
  styleUrls: ['./all-jop-insurances-choices.component.scss'],
})
export class AllJopInsurancesChoicesComponent implements OnInit, OnDestroy {
  jopInsuranceChoices: JopInsuranceChoice[] = [];
  jopInsuranceId: string = '';
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
      },
    },
    { field: 'en_title', header: 'English Title', sortable: true },
    { field: 'active_status', header: 'Active Status', sortable: true },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private jopInsuranceChoicesService: JopInsuranceChoicesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private dataRefreshService: DataRefreshService
  ) {}

  ngOnInit(): void {
    this.jopInsuranceId = this.route.snapshot.params['id'];
    this.refreshSubscription = this.dataRefreshService.refresh$
      .pipe(debounceTime(500))
      .subscribe(() => {
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
    this.jopInsuranceChoicesService
      .getAll()
      .pipe(
        tap((response) =>
          console.log('All job insurance choices request initiated', response)
        ),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data = response.data.filter(
            (choice) => choice.jop_insurance_id === +this.jopInsuranceId!
          );
          response.data.forEach((choice) => {
            choice.active_status =
              this.normalizeActiveStatusService.normalizeActiveStatus(
                choice.active_status
              );
          });
          return response;
        }),
        catchError((err) => {
          console.error('Error in loadData:', err);
          this.isLoading = false;
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoading = false;
          this.ngxSpinnerService.hide('actionsLoader');
        })
      )
      .subscribe({
        next: (response) => {
          this.jopInsuranceChoices = [...response.data];
        },
        error: (err) => {
          console.error('Failed to load job insurance choices', err);
          this.isLoading = false;
          this.ngxSpinnerService.hide('actionsLoader');
        },
      });
  }
}
