import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarTypesService, CarType } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { CarModelsService, CarModel } from '../../pages/dashboard/dashboard-pages/car-model/services/car-model.service';
import { CarBrandsService, CarBrand } from '../../pages/dashboard/dashboard-pages/car-brands/services/car-brands.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CarAddEditModelsResolver implements Resolve<any> {
  constructor(
    private carTypesService: CarTypesService,
    private carModelsService: CarModelsService,
    private carBrandsService: CarBrandsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    this.ngxSpinnerService.show('actionsLoader');

    if (id) {
      return forkJoin({
        carBrands: this.carBrandsService.getAll(),
        carModel: this.carModelsService.getById(+id)
      }).pipe(
        map(({ carBrands, carModel }) => ({
          carBrands: carBrands.data || [],
          carModel: carModel.data || null
        }))
      );
    } else {
      return forkJoin({
        carTypes: this.carTypesService.getAll(),
        carBrands: this.carBrandsService.getAll(),
        carModels: this.carModelsService.getAll()
      }).pipe(
        map(({ carTypes, carBrands, carModels }) => ({
          carTypes: carTypes.data || [],
          carBrands: carBrands.data || [],
          carModels: carModels.data || []
        }))
      );
    }
  }
}