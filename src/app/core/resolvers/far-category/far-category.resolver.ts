import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, finalize, timer } from 'rxjs';
import { ApiResponse, Category } from '../../../pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/h-products-edit/h-products-edit.component';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

export const farCategoryResolver: ResolveFn<Category[]> = () => {
  const http = inject(HttpClient);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');
  return http.get<ApiResponse<Category>>(`${WEB_SITE_BASE_URL}categories`).pipe(
    map(response => {
      if (response.status) {
        return response.data.filter(c => c.active_status === 1);
      }
      throw new Error('Failed to load categories');
    }),
    finalize(() => {
      // timer(200).subscribe(() =>  ngxSpinnerService.hide('actionsLoader'));
    })
  );
};