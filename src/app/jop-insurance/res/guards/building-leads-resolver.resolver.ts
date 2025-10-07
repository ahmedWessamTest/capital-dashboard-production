import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { NormalizeActiveStatusService } from '../../../core/normalize-active-status/normalize-active-status.service';
import {
  JopLeadResponse,
  JopLeadsListResponse,
  JopLeadsService,
} from '../services/jop-lead.service';

@Injectable({
  providedIn: 'root',
})
export class jopLeadsResolver
  implements Resolve<JopLeadsListResponse | JopLeadResponse>
{
  constructor(
    private buildingLeadsService: JopLeadsService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<JopLeadsListResponse | JopLeadResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');

    console.log('Resolver called with id:', id);

    if (id) {
      console.log('Fetching single building lead with id:', id);

      return this.buildingLeadsService.getById(+id).pipe(
        tap((response) => {
          console.log('Single building lead raw response:', response);
        }),
        map((response) => {
          // Transform single item data
          if (response?.data) {
            response.data.active_status =
              this.normalizeActiveStatusService.normalizeActiveStatus(
                response.data.active_status
              );
            response.data.need_call =
              response.data.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
            console.log('Transformed single building lead:', response.data);
          }
          return response;
        }),
        catchError((err) => {
          console.error('Error fetching single building lead:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }

    // Handle list case
    console.log('Fetching all building leads');
    return this.buildingLeadsService.getAll().pipe(
      tap((response) => {
        console.log('All building leads request initiated');
        console.log('Raw response:', response);
      }),
      map((response) => {
        if (!response?.data) {
          console.warn('No data in response');
          return response;
        }

        // Transform each item in the list
        response.data.forEach((lead) => {
          lead.active_status =
            this.normalizeActiveStatusService.normalizeActiveStatus(
              lead.active_status
            );
          lead.need_call =
            lead.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
        });

        console.log('Transformed building leads data:');
        console.table(response.data);
        return response;
      }),
      catchError((err) => {
        console.error('Error in resolver:', err);
        this.ngxSpinnerService.hide('actionsLoader');
        return throwError(() => err);
      })
    );
  }
}
