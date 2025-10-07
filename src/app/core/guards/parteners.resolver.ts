// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { CategoriesListResponse, CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
// import { PartnersListResponse, PartnerResponse, PartnersService } from '../../pages/dashboard/dashboard-pages/parteners/services/parteners.service';
// import { forkJoin } from 'rxjs';
// import { map } from 'rxjs/operators';
// @Injectable({
//   providedIn: 'root'
// })
// export class PartnersResolver implements Resolve<{partner: PartnerResponse, categories: CategoriesListResponse} | PartnersListResponse> {
//   constructor(
//     private partnersService: PartnersService,
//     private ngxSpinnerService: NgxSpinnerService,
//     private categoriesService: CategoriesService
//   ) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{partner: PartnerResponse, categories: CategoriesListResponse} | PartnersListResponse> {
//     this.ngxSpinnerService.show('actionsLoader');
//     const id = route.paramMap.get('id');
//     if (id) {
//       return forkJoin([
//         this.partnersService.getById(+id),
//         this.categoriesService.getAll()
//       ]).pipe(
//         map(([partner, categories]) => {
//           this.ngxSpinnerService.hide('actionsLoader');
//           return {partner, categories};
//         })
//       );
//     }
//     return this.partnersService.getAll();
//   }
// }
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoriesListResponse, CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { PartnersListResponse, PartnerResponse, PartnersService } from '../../pages/dashboard/dashboard-pages/parteners/services/parteners.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartnersResolver implements Resolve<{partner: PartnerResponse, categories: CategoriesListResponse} | PartnersListResponse> {
  constructor(
    private partnersService: PartnersService,
    private ngxSpinnerService: NgxSpinnerService,
    private categoriesService: CategoriesService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{partner: PartnerResponse, categories: CategoriesListResponse} | PartnersListResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    
    if (id) {
      return forkJoin([
        this.partnersService.getById(+id),
        this.categoriesService.getAll()
      ]).pipe(
        map(([partner, categories]) => {
          const category = categories.data.find(cat => cat.id === partner.data.category_id);
          partner.data.category = category; // Attach category object to partner
          this.ngxSpinnerService.hide('actionsLoader');
          return { partner, categories };
        })
      );
    }
    
    return this.partnersService.getAll().pipe(
      map(partners => {
        this.ngxSpinnerService.hide('actionsLoader');
        return partners;
      })
    );
  }
}