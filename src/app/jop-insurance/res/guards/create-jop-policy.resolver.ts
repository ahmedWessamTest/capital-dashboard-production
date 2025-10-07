// import { inject } from '@angular/core';
// import { ResolveFn } from '@angular/router';
// import { forkJoin, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { UserService, UsersResponse } from '../../../../../../../core/services/users/users.service';

// export interface JopPolicyResolverData {
//   users: UsersResponse;
//   jopData: JopDataResponse;
// }

// export const medicalPolicyResolver: ResolveFn<MedicalPolicyResolverData> = (): Observable<MedicalPolicyResolverData> => {
//   const medicalInsuranceService = inject(MedicalInsuranceService);
//   const userService = inject(UserService);
//   const ngxSpinnerService = inject(NgxSpinnerService);

//   ngxSpinnerService.show('actionsLoader');

//   return forkJoin({
//     users: userService.getAll(),
//     medicalData: medicalInsuranceService.fetchMedicalData()
//   });
// };
