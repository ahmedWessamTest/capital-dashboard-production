import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarBrand, CarBrandsService } from '../../pages/dashboard/dashboard-pages/car-brands/services/car-brands.service';
import { CarModel, CarModelsService } from '../../pages/dashboard/dashboard-pages/car-model/services/car-model.service';
import { CarType, CarTypesService } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { CarYearsService, CarYear } from '../../pages/dashboard/dashboard-pages/car-years/services/car-years.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { NgxSpinnerService } from 'ngx-spinner';

// Simplified interface for when we only need basic car year data
interface BasicCarYearData {
  id: number;
  year_date: string;
  car_model_id: number;
  car_model_title: string;
  car_brand_id: number;
  active_status: string;
  created_at: string;
  updated_at: string;
}

// Extended interface for the full combined data (used in list view)
interface CombinedCarData extends BasicCarYearData {
  car_brand_title: string;
  car_type_id: number;
  car_type_title: string;
}

interface CarYearWithModels {
  carYear: BasicCarYearData;
  carModels: CarModel[];
}

interface FullCarDataResponse {
  combinedData: CombinedCarData[];
  carTypes: CarType[];
  carBrands: CarBrand[];
  carModels: CarModel[];
}

@Injectable({
  providedIn: 'root',
})
export class CarYearsResolver implements Resolve<FullCarDataResponse | CarYearWithModels> {
  constructor(
    private carYearsService: CarYearsService,
    private carModelsService: CarModelsService,
    private carBrandsService: CarBrandsService,
    private carTypesService: CarTypesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<FullCarDataResponse | CarYearWithModels> {
    this.ngxSpinnerService.show('actionsLoader');

    const id = route.params['id'];

    if (id) {
      // If ID exists, get the specific car year and all car models
      return forkJoin({
        year: this.carYearsService.getById(+id),
        models: this.carModelsService.getAll(),
      }).pipe(
        map(({ year, models }) => {
          const yearData = year.data;
          const model = models.data.find((m: CarModel) => m.id === yearData.car_model_id);

          const carYear: BasicCarYearData = {
            id: yearData.id,
            year_date: yearData.year_date,
            car_model_id: yearData.car_model_id,
            car_model_title: model?.en_title || '',
            car_brand_id: model?.car_brand_id || 0,
            active_status: this.normalizeActiveStatusService.normalizeActiveStatus(yearData.active_status).toString(),
            created_at: yearData.created_at,
            updated_at: yearData.updated_at,
          };

          console.log("carYear",carYear, models.data)

          return {
            carYear,
            carModels: models.data,
          };
        })
      );
    } else {
      // Original behavior - get all data
      return forkJoin({
        years: this.carYearsService.getAll(),
        models: this.carModelsService.getAll(),
        brands: this.carBrandsService.getAll(),
        types: this.carTypesService.getAll(),
      }).pipe(
        map(({ years, models, brands, types }) => {
          const combinedData = years.data.map((year: CarYear) => {
            const model = models.data.find((m: CarModel) => m.id === year.car_model_id);
            const brand = brands.data.find((b: CarBrand) => b.id === model?.car_brand_id);
            const type = types.data.find((t: CarType) => t.id === brand?.car_type_id);
            return {
              id: year.id,
              year_date: year.year_date,
              car_model_id: year.car_model_id,
              car_model_title: model?.en_title || '',
              car_brand_id: model?.car_brand_id || 0,
              car_brand_title: brand?.en_title || '',
              car_type_id: brand?.car_type_id || 0,
              car_type_title: type?.en_title || '',
              active_status: this.normalizeActiveStatusService.normalizeActiveStatus(year.active_status).toString(),
              created_at: year.created_at,
              updated_at: year.updated_at,
            };
          });

          return {
            combinedData,
            carTypes: types.data,
            carBrands: brands.data,
            carModels: models.data,
          };
        })
      );
    }
  }
}