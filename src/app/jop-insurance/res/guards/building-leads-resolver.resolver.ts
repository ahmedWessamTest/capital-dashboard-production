import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, Observable, throwError } from 'rxjs';
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
  implements Resolve<JopLeadsListResponse | JopLeadResponse> {
  constructor(
    private buildingLeadsService: JopLeadsService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<JopLeadsListResponse | JopLeadResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');


    if (id) {

      return this.buildingLeadsService.getById(+id).pipe(

        map((response) => {
          // Transform single item data
          if (response?.data) {
            response.data.active_status =
              this.normalizeActiveStatusService.normalizeActiveStatus(
                response.data.active_status
              );
            response.data.need_call =
              response.data.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
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
    return this.buildingLeadsService.getAll().pipe(
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
