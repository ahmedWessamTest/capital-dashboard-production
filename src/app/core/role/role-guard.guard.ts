import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _router = inject(Router);

  if (isPlatformBrowser(_PLATFORM_ID)) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.role || '';

    // Define accessible base routes for each role
    const allowedRoutes = {
      admin: [
        '/dashboard/menu/jop-insurances',
        '/dashboard/menu/create-jop-policy',
        '/dashboard/home-statistics',
        '/dashboard/menu/create-medical-policy',
        '/dashboard/menu/create-motor-policy',
        '/dashboard/menu/create-building-policy',
        '/dashboard/menu/medical-insurances',
        '/dashboard/menu/motor-insurances',
        '/dashboard/menu/building-insurances',
        '/dashboard/menu/medical-claims/comments',
        '/dashboard/menu/motor-claims/comments',
        '/dashboard/menu/building-claims/comments',
        '/dashboard/menu/jop-claims/comments',
        '/dashboard/menu/building-request/comments',
        '/dashboard/menu/motor-request/comments',
        '/dashboard/menu/medical-request/comments',
        '/dashboard/menu/medical-claims',
        '/dashboard/menu/motor-claims',
        '/dashboard/menu/building-claims',
        '/dashboard/menu/jop-claims',
        '/dashboard/menu/medical-requests',
        '/dashboard/menu/motor-requests',
        '/dashboard/menu/building-requests',
        '/dashboard/menu/jop-requests',
        '/dashboard/menu/jop-request/comments',
        '/dashboard/menu/leads',
        '/dashboard/menu/medical/add-medical-choice',
        '/dashboard/menu/motor/add-motor-choice',
        '/dashboard/menu/building/add-building-choice',
        '/dashboard/menu/jop/add-jop-choice',
        '/dashboard/menu/build-types',
        '/dashboard/menu/build-countries',
        '/dashboard/menu/car-brands',
        '/dashboard/menu/car-models',
        '/dashboard/menu/car-types',
        '/dashboard/menu/all-users',
        '/dashboard/menu/add-user',
        '/dashboard/menu/view-user',
        '/dashboard/menu/all-employees',
        '/dashboard/menu/add-employee',
        '/dashboard/menu/view-employee',

        '/dashboard/menu/sliders',
        '/dashboard/menu/testimonials',
        '/dashboard/menu/en-blogs',
        '/dashboard/menu/ar-blogs',
        '/dashboard/menu/categories',
        '/dashboard/menu/partners',
        '/dashboard/menu/counters',
        '/dashboard/menu/features',
        '/dashboard/menu/claim-info',
        '/dashboard/menu/clients',
        '/dashboard/menu/adminstrations',
        '/dashboard/menu/contact-form',
        '/dashboard/menu/social-links',
        '/dashboard/menu/send-notification',
        '/dashboard/menu/expire-notifications',
        '/dashboard/menu/admin-notifications',
        '/dashboard/menu/about-us',
        '/dashboard/menu/download-info',
        '/dashboard/menu/privacy-policy',

      ],
      employee: [
        '/dashboard/home-statistics',
        '/dashboard/menu/create-medical-policy',
        '/dashboard/menu/create-motor-policy',
        '/dashboard/menu/create-building-policy',
        '/dashboard/menu/create-jop-policy',
        '/dashboard/menu/medical-claims',
        '/dashboard/menu/motor-claims',
        '/dashboard/menu/building-claims',
        '/dashboard/menu/jop-claims',
        '/dashboard/menu/medical-requests',
        '/dashboard/menu/motor-requests',
        '/dashboard/menu/building-requests',
        '/dashboard/menu/jop-requests',
        '/dashboard/menu/jop-request/comments',
        '/dashboard/menu/leads',
        '/dashboard/menu/medical/add-medical-choice',
        '/dashboard/menu/motor/add-motor-choice',
        '/dashboard/menu/building/add-building-choice',
        '/dashboard/menu/jop/add-jop-choice',
        '/dashboard/menu/medical-claims/comments',
        '/dashboard/menu/motor-claims/comments',
        '/dashboard/menu/building-claims/comments',
        '/dashboard/menu/jop-claims/comments',
        '/dashboard/menu/building-request/comments',
        '/dashboard/menu/motor-request/comments',
        '/dashboard/menu/medical-request/comments',
      ],
    };

    // Check if the requested route or its parent is allowed
    const isRouteAllowed = allowedRoutes[
      userRole as keyof typeof allowedRoutes
    ]?.some(
      (allowedRoute: string) =>
        state.url.startsWith(allowedRoute) || state.url === allowedRoute
    );
    console.log('from guard user role', userRole);
    if (userRole && isRouteAllowed) {
      return true;
    } else {
      _router.navigate(['/dashboard/home-statistics']);
      return false;
    }
  }

  return true;
};
