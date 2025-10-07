import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildTypeResponse, BuildTypesListResponse, BuildTypesService } from '../../pages/dashboard/dashboard-pages/build-types/services/build-types.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class buildTypesResolver implements Resolve<BuildTypesListResponse | BuildTypeResponse> {
  constructor(
    private buildTypesService: BuildTypesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BuildTypesListResponse | BuildTypeResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.buildTypesService.getById(+id).pipe(
        map((response: BuildTypeResponse ) => {
          if(response.data.active_status){
            response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
          }
          return response;
        })
      );
    }
    return this.buildTypesService.getAll().pipe(
      map((response: BuildTypesListResponse) => {
        response.data.forEach((buildType) => {
          if(buildType.active_status){
            buildType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(buildType.active_status);
          }
        });
        return response;
      })
    );
  }
}