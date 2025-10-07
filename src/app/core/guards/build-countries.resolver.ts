// medical-leads-with-categories.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { BuildCountriesService, BuildCountryResponse } from '../../pages/dashboard/dashboard-pages/build-countries/services/build-countries.service';
import { BuildTypesService } from '../../pages/dashboard/dashboard-pages/build-types/services/build-types.service';

@Injectable({
  providedIn: 'root'
})
export class BuildCountriesWithTypes implements Resolve<any> {
  constructor(
    private buildCountriesService: BuildCountriesService,
    private buildTypesService: BuildTypesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.ngxSpinnerService.show('actionsLoader');
    
    const id = route.paramMap.get('id');
    
    if (id) {
      return this.buildCountriesService.getById(+id).pipe(
        switchMap((buildCountry: BuildCountryResponse) => {
          return forkJoin([
            of(buildCountry),
            this.buildTypesService.getAll()
          ]).pipe(
            map(([buildCountry, typesResponse]) => {
              const types = typesResponse.data;
              types.forEach(type => {
                type.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(type.active_status);
              });
              buildCountry.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(buildCountry.data.active_status);
              return {
                buildCountry,
                buildTypes: types.map(type => ({ success: true, message: '', data: type }))
              };
            })
          );
        })
      );
    }
    return forkJoin([
      this.buildCountriesService.getAll(),
      this.buildTypesService.getAll()
    ]).pipe(
      map(([countriesResponse, typesResponse]) => {
        const countries = countriesResponse.data;
        const types = typesResponse.data;
        types.forEach(type => {
          type.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(type.active_status);
        });
        
        // Merge categories into motor leads
        const mergedData = countries.map(country => ({
          ...country,
          active_status: this.normalizeActiveStatusService.normalizeActiveStatus(country.active_status),
          build_type: types.find(c => c.id === country.build_type_id)
          
        }));
        
        return {
          buildCountries: mergedData,
          buildTypes: types
        };
      })
    );
  }
}


