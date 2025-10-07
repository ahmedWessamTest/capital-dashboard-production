import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { MedicalClaimResponse, ClaimComment, MedicalClaimsService } from '../services/claims/medical-claim.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalClaimsCommentsResolver implements Resolve<{ claim: MedicalClaimResponse; comments: ClaimComment[] }> {
  constructor(
    private medicalClaimsService: MedicalClaimsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ claim: MedicalClaimResponse; comments: ClaimComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const claimId = +route.paramMap.get('id')!;
    return forkJoin({
      claim: this.medicalClaimsService.getById(claimId),
      comments: this.medicalClaimsService.getClaimComments(claimId)
    })
    .pipe(
      map((data) => ({
        claim: data.claim,
        comments: data.comments.data
      }))
    );    
  }
}