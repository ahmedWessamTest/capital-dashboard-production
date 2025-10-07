import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { catchError, finalize, throwError } from 'rxjs';
let activeRequests = 0;
export const loadingSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const messageService = inject(MessageService);
   const spinnerName = 'actionsLoader'; // لو بتستخدم اسم مخصص اكتب هنا

  if (activeRequests === 0) {
    console.log(req.url);
    if(!req.url.includes('admincommecnts')){
      spinner.show(spinnerName);
    }
  }
  activeRequests++;

  return next(req).pipe(
    catchError((error: any) => {
      console.error('HTTP Error:', error);
      console.log(error.error.message);
      if(error.error.message === 'Failed to fetch') {
        messageService.add({
          severity: 'error',
          summary: 'Timeout',
          detail: 'Failed to when Data',
          life: 5000
        });
      }
      return throwError(() => error);
    }),
    finalize(() => {
      activeRequests--;
        if(!req.url.includes('admincommecnts')){
          spinner.hide(spinnerName);
        }
        
      
    })
  );
};
