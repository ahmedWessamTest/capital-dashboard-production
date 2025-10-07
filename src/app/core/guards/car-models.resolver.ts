import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarTypesService, CarType } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { CarModelsService, CarModel } from '../../pages/dashboard/dashboard-pages/car-model/services/car-model.service';
import { CarBrand, CarBrandsService } from '../../pages/dashboard/dashboard-pages/car-brands/services/car-brands.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class CarModelsResolver implements Resolve<any> {
  constructor(
    private carTypesService: CarTypesService,
    private carModelsService: CarModelsService,
    private carBrandsService: CarBrandsService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');

    if (id) {
      return forkJoin({
        carTypes: this.carTypesService.getAll(),
        carModel: this.carModelsService.getById(+id)
      }).pipe(
        map(({ carTypes, carModel }) => ({
          carTypes: carTypes.data || [],
          carModel: carModel.data || null
        }))
      );
    } 
      else {
        return forkJoin({
          models: this.carModelsService.getAll(),
          brands: this.carBrandsService.getAll(),
          types: this.carTypesService.getAll(),
        }).pipe(
          map(({ models, brands, types }) => {
            const combinedData = models.data.map((model: CarModel) => {
              const brand = brands.data.find((b: CarBrand) => b.id === model.car_brand_id);
              const type = types.data.find((t: CarType) => t.id === brand?.car_type_id);
              return {
                id: model.id,
                en_title: model.en_title,
                ar_title: model.ar_title,
                car_brand_id: model.car_brand_id,
                car_brand_title: brand?.en_title || '',
                car_type_id: brand?.car_type_id || 0,
                car_type_title: type?.en_title || '',
                active_status: this.normalizeActiveStatusService.normalizeActiveStatus(model.active_status).toString(),
                created_at: model.created_at,
                updated_at: model.updated_at,
              };
            });
            console.log(combinedData);
            return {
              combinedData,
              carBrands: brands.data,
              carTypes: types.data,
            };
          })
        );
  }
}}