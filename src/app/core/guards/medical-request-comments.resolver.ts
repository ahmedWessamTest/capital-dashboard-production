import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MedicalRequestCommentsService, MedicalRequestComment } from '../../pages/dashboard/dashboard-pages/medical-request-comment/services/medical-request-comment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalRequestsService, MedicalRequestResponse } from '../../pages/dashboard/dashboard-pages/medical-requests/services/medical-requests.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicalRequestCommentsResolver implements Resolve<{ request: MedicalRequestResponse; comments: MedicalRequestComment[] }> {
  constructor(
    private commentsService: MedicalRequestCommentsService,
    private medicalRequestsService: MedicalRequestsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ request: MedicalRequestResponse; comments: MedicalRequestComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const requestId = +route.paramMap.get('id')!;
    return forkJoin({
      request: this.medicalRequestsService.getById(requestId),
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