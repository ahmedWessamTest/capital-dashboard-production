import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdministrationsListResponse, AdministrationResponse, AdministrationsService } from '../../pages/dashboard/dashboard-pages/adminstrations/services/adminstrations.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class adminstrationsResolver implements Resolve<AdministrationsListResponse | AdministrationResponse> {
  constructor(
    private adminstrationsService: AdministrationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdministrationsListResponse | AdministrationResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    // console.log("id",id)
    if (id) {
      console.log("id",id)
        return this.adminstrationsService.getById(+id);
    }
    // return this.aboutCountersService.getAll();
    return this.adminstrationsService.getAll();
  }
}