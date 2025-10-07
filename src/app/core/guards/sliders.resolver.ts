import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SlidersListResponse, SliderResponse, SlidersService } from '../../pages/dashboard/dashboard-pages/sliders/service/sliders.service';

@Injectable({
  providedIn: 'root'
})
export class SlidersResolver implements Resolve<SlidersListResponse | SliderResponse> {
  constructor(
    private slidersService: SlidersService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SlidersListResponse | SliderResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.slidersService.getById(+id);
    }
    return this.slidersService.getAll();
  }
}