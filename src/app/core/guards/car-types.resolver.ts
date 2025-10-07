import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarTypeResponse, CarTypesListResponse, CarTypesService } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class carTypesResolver implements Resolve<CarTypesListResponse | CarTypeResponse> {
  constructor(
    private carTypesService: CarTypesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CarTypesListResponse | CarTypeResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.carTypesService.getById(+id).pipe(
        map((response: CarTypeResponse ) => {
          if(response.data.active_status){
            response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
          }
          return response;
        })
      );
    }
    return this.carTypesService.getAll().pipe(
      map((response: CarTypesListResponse) => {
        response.data.forEach((carType) => {
          if(carType.active_status){
            carType.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(carType.active_status);
          }
        });
        return response;
      })
    );
  }
}