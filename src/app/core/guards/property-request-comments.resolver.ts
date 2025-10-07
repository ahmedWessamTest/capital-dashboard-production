import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { BuildingRequestComment, BuildingRequestCommentsService } from '../../pages/dashboard/dashboard-pages/property-comments/services/property-comments.service';
import { BuildingRequestResponse, BuildingRequestsService } from '../../pages/dashboard/dashboard-pages/property-requests/services/property-requests.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingRequestCommentsResolver implements Resolve<{ request: BuildingRequestResponse; comments: BuildingRequestComment[] }> {
  constructor(
    private commentsService: BuildingRequestCommentsService,
    private buildingRequestsService: BuildingRequestsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ request: BuildingRequestResponse; comments: BuildingRequestComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const requestId = +route.paramMap.get('id')!;
    return forkJoin({
      request: this.buildingRequestsService.getById(requestId),
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