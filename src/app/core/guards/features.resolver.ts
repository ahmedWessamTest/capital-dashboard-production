import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FeaturesListResponse, FeatureResponse, FeaturesService } from '../../pages/dashboard/dashboard-pages/features/services/features.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class FeaturesResolver implements Resolve<FeaturesListResponse | FeatureResponse> {
  constructor(
    private featuresService: FeaturesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeaturesListResponse | FeatureResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    // console.log("id",id)
    if (id) {
      console.log("id",id)
        return this.featuresService.getById(+id);
    }
    // return this.aboutCountersService.getAll();
    return this.featuresService.getAll();
  }
}