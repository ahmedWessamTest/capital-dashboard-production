import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormalizeActiveStatusService {

  constructor() { }

  
   normalizeActiveStatus(status: any): boolean {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string') return status === '1' || status.toLowerCase() === 'true';
    return status === 1;
  }
}
