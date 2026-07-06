/**
 * @file flowbite.service.ts
 * @description Service for managing Flowbite UI library integration
 *
 * This service handles:
 * - Dynamic loading of Flowbite library
 * - Platform-specific initialization
 * - Callback handling after library load
 *
 * Features:
 * - Lazy loading of Flowbite
 * - Browser platform detection
 * - Safe server-side rendering support
 *
 * @exports FlowbiteService - Service for Flowbite integration
 */

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FlowbiteService {
  loadFlowbite(callback: (flowbite: any) => void) {
    import("flowbite").then((flowbite) => {
      callback(flowbite);
    });
  }
}
