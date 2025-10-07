import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { MotorRequestCommentsService } from '../../pages/dashboard/dashboard-pages/motors-comments/services/motors-comments.service';
import { MotorRequestsService } from '../../pages/dashboard/dashboard-pages/motors-requests/services/motors-requests.service';
import { MotorRequestResponse } from '../../pages/dashboard/dashboard-pages/motors-requests/services/motors-requests.service';
import { MotorRequestComment } from '../../pages/dashboard/dashboard-pages/motors-comments/services/motors-comments.service';

@Injectable({
  providedIn: 'root'
})
export class MotorRequestsCommentsResolver implements Resolve<{ request: MotorRequestResponse; comments: MotorRequestComment[] }> {
  constructor(
    private commentsService: MotorRequestCommentsService,
    private motorRequestsService: MotorRequestsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ request: MotorRequestResponse; comments: MotorRequestComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const requestId = +route.paramMap.get('id')!;
    return forkJoin({
      request: this.motorRequestsService.getById(requestId),
      comments: this.commentsService.getAll(requestId)
    })
    .pipe(
      map((data) => ({
        request: data.request,
        comments: data.comments.data
      }))
    );    
  }
}