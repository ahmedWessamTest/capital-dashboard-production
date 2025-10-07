import { ResolveFn } from '@angular/router';
import { IAllCategory } from '../../Interfaces/h-category/IAllCategory';
import { inject } from '@angular/core';
import { CategoriesService } from '../../services/h-category/categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, timer } from 'rxjs';

export const allCategoriesResolver: ResolveFn<boolean|IAllCategory> = (route, state) => {
  const categoriesService = inject(CategoriesService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show("actionsLoader");
  return categoriesService.getAllCategories().pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide('actionsLoader'));
    })
  );
};
