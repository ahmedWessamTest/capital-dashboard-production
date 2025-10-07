import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoryResponse, CategoriesListResponse, CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolver implements Resolve<CategoriesListResponse | CategoryResponse> {
  constructor(
    private categoriesService: CategoriesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoriesListResponse | CategoryResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.categoriesService.getById(+id);
    }
    return this.categoriesService.getAll();
  }
}