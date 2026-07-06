import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';

let activeRequests = 0;

export const loadingSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const messageService = inject(MessageService);
  const spinnerName = 'actionsLoader';

  const shouldShowSpinner = !req.url.includes('admincommecnts');

  if (shouldShowSpinner) {
    if (activeRequests === 0) {
      spinner.show(spinnerName);
    }
    activeRequests++;
  }

  return next(req).pipe(
    catchError((error: any) => {
      console.error('HTTP Error:', error);
      if (error.error?.message === 'Failed to fetch' || error.message === 'Failed to fetch') {
        messageService.add({
          severity: 'error',
          summary: 'Timeout',
          detail: 'Failed to retrieve data',
          life: 5000
        });
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (shouldShowSpinner) {
        activeRequests--;
        if (activeRequests <= 0) {
          activeRequests = 0;
          spinner.hide(spinnerName);
        }
      }
    })
  );
};
