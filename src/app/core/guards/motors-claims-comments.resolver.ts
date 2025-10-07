import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { ClaimComment } from '../services/claims/medical-claim.service';
import { MotorClaimResponse, MotorClaimsService } from '../services/claims/motor-claim.service';

@Injectable({
  providedIn: 'root'
})
export class MotorClaimsCommentsResolver implements Resolve<{ claim: MotorClaimResponse; comments: ClaimComment[] }> {
  constructor(
    private motorClaimsService: MotorClaimsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ claim: MotorClaimResponse; comments: ClaimComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const claimId = +route.paramMap.get('id')!;
    return forkJoin({
      claim: this.motorClaimsService.getById(claimId),
      comments: this.motorClaimsService.getClaimComments(claimId)
    })
    .pipe(
      map((data) => ({
        claim: data.claim,
        comments: data.comments.data
      }))
    );    
  }
}