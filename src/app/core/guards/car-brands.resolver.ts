import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarBrand, CarBrandsService } from '../../pages/dashboard/dashboard-pages/car-brands/services/car-brands.service';
import { CarType, CarTypesService } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

interface CombinedCarBrandData {
  id: number;
  en_title: string;
  ar_title: string;
  car_type_id: number;
  car_type_title: string;
  active_status: string;
  created_at: string;
  updated_at: string;
}

interface CarBrandWithTypes {
  carBrand: Omit<CarBrand, 'active_status'> & { active_status: boolean };
  carTypes: CarType[];
}

interface CombinedCarBrandResponse {
  combinedData: CombinedCarBrandData[];
  carTypes: CarType[];
}

@Injectable({
  providedIn: 'root',
})
export class CarBrandsResolver implements Resolve<CarBrandWithTypes | CombinedCarBrandResponse> {
  constructor(
    private carBrandsService: CarBrandsService,
    private carTypesService: CarTypesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CarBrandWithTypes | CombinedCarBrandResponse> {
    this.ngxSpinnerService.show('actionsLoader');

    const id = route.params['id'];

    if (id) {
      // If ID exists, get the specific car brand and all car types
      return forkJoin({
        brand: this.carBrandsService.getById(+id),
        types: this.carTypesService.getAll(),
      }).pipe(
        map(({ brand, types }) => {
          const brandData = brand.data;
          return {
            carBrand: {
              ...brandData,
              active_status: this.normalizeActiveStatusService.normalizeActiveStatus(brandData.active_status),
            },
            carTypes: types.data,
          };
        })
      );
    } else {
      // If no ID, get all brands and types for list view
      return forkJoin({
        brands: this.carBrandsService.getAll(),
        types: this.carTypesService.getAll(),
      }).pipe(
        map(({ brands, types }) => {
          const combinedData = brands.data.map((brand: CarBrand) => {
            const type = types.data.find((t: CarType) => t.id === brand.car_type_id);
            return {
              id: brand.id,
              en_title: brand.en_title,
              ar_title: brand.ar_title,
              car_type_id: brand.car_type_id,
              car_type_title: type?.en_title || '',
              active_status: this.normalizeActiveStatusService.normalizeActiveStatus(brand.active_status).toString(),
              created_at: brand.created_at,
              updated_at: brand.updated_at,
            };
          });

          return {
            combinedData,
            carTypes: types.data,
          };
        })
      );
    }
  }
}