import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AboutCountersListResponse, AboutCounterResponse, AboutCountersService } from '../../pages/dashboard/dashboard-pages/counters/services/counters.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CountersResolver implements Resolve<AboutCountersListResponse | AboutCounterResponse> {
  constructor(
    private aboutCountersService: AboutCountersService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AboutCountersListResponse | AboutCounterResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    // console.log("id",id)
    if (id) {
      console.log("id",id)
        return this.aboutCountersService.getById(+id);
    }
    // return this.aboutCountersService.getAll();
    return this.aboutCountersService.getAll();
  }
}