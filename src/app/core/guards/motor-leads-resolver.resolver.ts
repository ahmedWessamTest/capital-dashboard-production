import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorLeadResponse, MotorLeadsListResponse, MotorLeadsService } from '../../pages/dashboard/dashboard-pages/motors-lead/services/motors-lead.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class motorLeadsResolver implements Resolve<MotorLeadsListResponse | MotorLeadResponse> {
  constructor(
    private motorLeadsService: MotorLeadsService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MotorLeadsListResponse | MotorLeadResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    
    console.log('Resolver called with id:', id);

    if (id) {
      console.log('Fetching single motor lead with id:', id);
      
      return this.motorLeadsService.getById(+id).pipe(
        tap((response) => {
          console.log('Single motor lead raw response:', response);
        }),
        map((response) => {
          // Transform single item data
          if (response?.data) {
            response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
            response.data.need_call = response.data.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
            console.log('Transformed single motor lead:', response.data);
          }
          return response;
        }),
        catchError(err => {
          console.error('Error fetching single motor lead:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }

    // Handle list case
    console.log('Fetching all motor leads');
    return this.motorLeadsService.getAll().pipe(
      tap((response) => {
        console.log('All motor leads request initiated');
        console.log('Raw response:', response);
      }),
      map((response) => {
        if (!response?.data) {
          console.warn('No data in response');
          return response;
        }

        // Transform each item in the list
        response.data.forEach((lead) => {
          lead.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(lead.active_status);
          lead.need_call = lead.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
        });

        console.log('Transformed motor leads data:');
        console.table(response.data);
        return response;
      }),
      catchError(err => {
        console.error('Error in resolver:', err);
        this.ngxSpinnerService.hide('actionsLoader');
        return throwError(() => err);
      })
    );
  }
}