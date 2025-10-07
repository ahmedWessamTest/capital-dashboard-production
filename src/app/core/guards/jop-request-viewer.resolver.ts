import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { GetAllJop } from '../../jop-insurance/res/interface/getAllJop';
import { JopInsurancesService } from '../../jop-insurance/res/services/jop-insurance.service';
import {
  CategoriesListResponse,
  CategoriesService,
} from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import {
  JobRequestResponse,
  JobRequestsListResponse,
  JobRequestsService,
} from '../../pages/dashboard/dashboard-pages/jop-requests/services/jop-requests.service';

export interface JobRequestCombinedData {
  jobInsurances: GetAllJop;
  categories: CategoriesListResponse;
  jobRequest?: JobRequestResponse;
}

export const jopRequestViewerResolver: ResolveFn<
  JobRequestCombinedData | JobRequestsListResponse
> = (route, state) => {
  const jobRequestsService = inject(JobRequestsService);
  const categoriesService = inject(CategoriesService);
  const jobInsurancesService = inject(JopInsurancesService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  const id = route.paramMap.get('id');

  ngxSpinnerService.show('actionsLoader');

  if (!id) {
    return forkJoin({
      jobInsurances: jobInsurancesService.getAll(),
      categories: categoriesService.getAll(),
    });
  }

  return forkJoin({
    jobInsurances: jobInsurancesService.getAll(),
    categories: categoriesService.getAll(),
    jobRequest: jobRequestsService.getById(+id),
  });
};
