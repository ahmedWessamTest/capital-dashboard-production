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
  JobClaimResponse,
  JobClaimsService,
} from '../services/claims/jop-claim.service';
import { ClaimComment } from '../services/claims/medical-claim.service';

@Injectable({
  providedIn: 'root',
})
export class JobClaimsCommentsResolver
  implements Resolve<{ claim: JobClaimResponse; comments: ClaimComment[] }>
{
  constructor(
    private jobClaimsService: JobClaimsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ claim: JobClaimResponse; comments: ClaimComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const claimId = +route.paramMap.get('id')!;
    return forkJoin({
      claim: this.jobClaimsService.getById(claimId),
      comments: this.jobClaimsService.getClaimComments(claimId),
    }).pipe(
      map((data) => ({
        claim: data.claim,
        comments: data.comments.data,
      }))
    );
  }
}
