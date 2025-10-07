// custom-route-reuse.strategy.ts
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Don't detach any routes - this forces recreation
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // Don't store anything
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Don't attach any stored routes
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Don't retrieve any stored routes
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Force recreation for specific routes
    const routesToRecreate = [
      '/dashboard/menu/medical-insurances',
      'medical-insurances'
    ];
    
    const currentPath = curr.routeConfig?.path || '';
    const futurePath = future.routeConfig?.path || '';
    
    // If navigating to a route that should be recreated, don't reuse
    if (routesToRecreate.includes(currentPath) || routesToRecreate.includes(futurePath)) {
      return false;
    }
    
    // Default behavior for other routes
    return future.routeConfig === curr.routeConfig;
  }
}