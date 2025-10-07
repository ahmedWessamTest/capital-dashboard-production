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
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
  provideRouter,
  withRouterConfig,
  
} from "@angular/router";

import { IMAGE_CONFIG } from "@angular/common";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideShareButtonsOptions, SharerMethods, withConfig } from "ngx-sharebuttons";
import { shareIcons } from "ngx-sharebuttons/icons";
import { routes } from "./app.routes";
// import { networkInterceptor } from "./core/interceptors/is-stable.interceptor";
import { loadingSpinnerInterceptor } from "./core/interceptors/loading-spinner.interceptor";
import { networkInterceptor }  from "./core/interceptors/is-stable.interceptor";
import { MessageService } from "primeng/api";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { CustomRouteReuseStrategy } from "./core/custom-route-reuse.strategy";
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
    // Router configuration with in-memory scrolling and view transitions
    // provideRouter(routes, inMemoryScrollingFeature, withViewTransitions()),

    // Enables Server-Side Rendering (SSR) hydration
    provideClientHydration(),

    // Enables Angular animations
    provideAnimations(),

    // Toast notification configuration
    // provideToastr({
    //   positionClass: "toast-top-left",  // Shows toasts in the top-left corner
    //   timeOut: 20000,                    // Toasts disappear after 2 seconds
    //   preventDuplicates: true           // Prevents duplicate toast messages
    // }),

    // HTTP Client configuration with interceptors
    provideHttpClient(
      withInterceptors([
        loadingSpinnerInterceptor, 
        authInterceptor     // Handles loading spinner state
        // networkInterceptor,             // Handles network state
      ]),
      withFetch()                       // Enables fetch for lazy loading
    ),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    // Date range picker configuration
    // Social sharing buttons configuration
    provideShareButtonsOptions(
      shareIcons(),
      withConfig({
        debug: true,
        sharerMethod: SharerMethods.Anchor,
      })
    ),

    // Image configuration to disable warnings
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,      // Disables image size warnings
        disableImageLazyLoadWarning: true,  // Disables lazy loading warnings
      },
    },
  ],
};
