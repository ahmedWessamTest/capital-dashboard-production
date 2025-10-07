import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { BuildingClaimResponse, BuildingClaimsService } from '../services/claims/building-claim.service';
import { ClaimComment } from '../services/claims/medical-claim.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingClaimsCommentsResolver implements Resolve<{ claim: BuildingClaimResponse; comments: ClaimComment[] }> {
  constructor(
    private buildingClaimsService: BuildingClaimsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ claim: BuildingClaimResponse; comments: ClaimComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const claimId = +route.paramMap.get('id')!;
    return forkJoin({
      claim: this.buildingClaimsService.getById(claimId),
      comments: this.buildingClaimsService.getClaimComments(claimId)
    })
    .pipe(
      map((data) => ({
        claim: data.claim,
        comments: data.comments.data
      }))
    );    
  }
}