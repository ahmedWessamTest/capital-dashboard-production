import { isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { ApplicationRef, inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, finalize, first, retryWhen, scan, throwError, timeout, TimeoutError } from "rxjs";

const NO_RETRY_APIS = [
  "signup",
  "signin",
  "resetUserCode",
  "resetUserPassword",
  "updateUserPassword",
  "deleteuseraccount",
  "updateUserProfile",
];

export const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const appRef = inject(ApplicationRef);
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _Router = inject(Router);

  const shouldSkipRetry = NO_RETRY_APIS.some((endpoint) => req.url.includes(endpoint));

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 20000; // 500ms delay
  const PENDING_TIMEOUT = 40000; // 30 seconds

  return next(req).pipe(
    shouldSkipRetry
      ? catchError((error: HttpErrorResponse) => throwError(() => error))
      : retryWhen((errors) =>
          errors.pipe(
            scan((retryCount, error) => {
              if (!navigator.onLine) {
                console.warn("⚠️ No internet connection detected.");
                
                // Throw a custom error for internet connection issues
                throw new Error("NoInternetError");
              }

              // Retry logic for network-related errors
              if (
                retryCount >= MAX_RETRIES ||
                (error.status !== 0 && error.status < 500) ||
                error.status === 502 ||
                error.status === 504
              ) {
                console.error("❌ Network issue: Unable to reach the server after retries.");
                throw error; // Stop retrying after max retries or specific errors
              }

              console.warn(`Retrying request... (${retryCount + 1}/${MAX_RETRIES})`);
              return retryCount + 1;
            }, 0),
            delay(RETRY_DELAY)
          )
        ),
    catchError((error: HttpErrorResponse) => {
      // Check for the custom "NoInternetError" and navigate to the error page
      if (error.message === "NoInternetError") {
        _Router.navigate(["/internet-error"]);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (isPlatformBrowser(_PLATFORM_ID)) {
        appRef.isStable.pipe(
          first((stable) => stable),
          timeout(10000)
        );
      }
    }),
    // Add a timeout to detect long-pending requests
    timeout(PENDING_TIMEOUT),
    catchError((error: any) => {
      if (error instanceof TimeoutError) {
      }
      return throwError(() => error);
    })
  );
};
