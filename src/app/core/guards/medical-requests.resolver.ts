import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MedicalRequestsListResponse, MedicalRequestResponse, MedicalRequestsService } from '../../pages/dashboard/dashboard-pages/medical-requests/services/medical-requests.service';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { MedicalInsurancesService, MedicalInsuranceResponse } from '../../pages/dashboard/dashboard-pages/medical-insurances/services/medical-insurances.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';

export interface MedicalRequestCombinedResponse {
  medicalRequest: MedicalRequestResponse;
  category: CategoryResponse;
  medicalInsurance: MedicalInsuranceResponse;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRequestsResolver implements Resolve<MedicalRequestsListResponse | MedicalRequestCombinedResponse> {
  private readonly _messageService = inject(MessageService);
  constructor(
    private medicalRequestsService: MedicalRequestsService,
    private categoriesService: CategoriesService,
    private medicalInsurancesService: MedicalInsurancesService,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MedicalRequestsListResponse | MedicalRequestCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const idParam = route.paramMap.get('id');
const id = idParam ? Number(idParam) : null;
if (!id) {
  return this.medicalRequestsService.getAll();
}
console.log(id);

    return this.medicalRequestsService.getById(id).pipe(
      switchMap((medicalRequest: MedicalRequestResponse) => {
        const categoryId = medicalRequest.data.category_id;
        const medicalInsuranceId = medicalRequest?.data.medical_insurance_id;
        if(!medicalInsuranceId) {
          this.ngxSpinnerService.hide("actionsLoader")
return EMPTY;
        }

        return forkJoin([
          of(medicalRequest),
          this.categoriesService.getById(categoryId),
          this.medicalInsurancesService.getById(medicalInsuranceId)
        ]).pipe(
          map(([medicalRequest, category, medicalInsurance]) => ({
            medicalRequest,
            category,
            medicalInsurance
          }))
        );
      })
    );
  }
}