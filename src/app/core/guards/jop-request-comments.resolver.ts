import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  JobRequestComment,
  JobRequestCommentsService,
} from '../../pages/dashboard/dashboard-pages/jop-comments/services/jop-comments.service';
import {
  JobRequestResponse,
  JobRequestsService,
} from '../../pages/dashboard/dashboard-pages/jop-requests/services/jop-requests.service';

@Injectable({
  providedIn: 'root',
})
export class JobRequestCommentsResolver
  implements
    Resolve<{ request: JobRequestResponse; comments: JobRequestComment[] }>
{
  constructor(
    private commentsService: JobRequestCommentsService,
    private jobRequestsService: JobRequestsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    request: JobRequestResponse;
    comments: JobRequestComment[];
  }> {
    this.ngxSpinnerService.show('actionsLoader');
    const requestId = +route.paramMap.get('id')!;
    return forkJoin({
      request: this.jobRequestsService.getById(requestId),
      comments: this.commentsService.getAll(requestId),
    }).pipe(
      map((data) => ({
        request: data.request,
        comments: data.comments.data,
      }))
    );
  }
}
