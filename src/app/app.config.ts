/**
 * @file app.config.ts
 * @description Main application configuration file for Angular application
 *
 * This file configures core Angular application features including:
 * - Router configuration with scroll behavior
 * - Server-side rendering (SSR) hydration
 * - Angular animations
 * - Toast notifications
 * - HTTP client with interceptors
 * - Date range picker
 * - Social sharing buttons
 * - Image configuration
 *
 * @exports appConfig - Main application configuration object
 */
import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withRouterConfig,

} from "@angular/router";

import { IMAGE_CONFIG } from "@angular/common";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";
import { loadingSpinnerInterceptor } from "./core/interceptors/loading-spinner.interceptor";
import { MessageService } from "primeng/api";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { cleanBodyInterceptor } from "./core/interceptors/clean-body.interceptor";
/**
 * @description Configuration for in-memory scrolling behavior
 * @property scrollPositionRestoration - Restores scroll position to "top" when navigating
 * @property anchorScrolling - Enables anchor scrolling for fragment navigation
 */
// const scrollConfig: InMemoryScrollingOptions = {
//   scrollPositionRestoration: "top",
//   anchorScrolling: "enabled",
// };

/**
 * @description Feature configuration for in-memory scrolling using the defined scroll config
 */
// const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

/**
 * @description Main application configuration object that provides all necessary services and features
 * @exports appConfig 
 */
export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        loadingSpinnerInterceptor,
        cleanBodyInterceptor,
        authInterceptor
      ]),
      withFetch()
    ),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),

    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
      },
    },
  ],
};
