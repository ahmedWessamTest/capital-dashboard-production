// medical-leads-with-categories.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorLeadsService } from '../../pages/dashboard/dashboard-pages/motors-lead/services/motors-lead.service';
import { CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class MotorLeadsWithCategoriesResolver implements Resolve<any> {
  constructor(
    private motorLeadsService: MotorLeadsService,
    private categoriesService: CategoriesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.ngxSpinnerService.show('actionsLoader');
    
    return forkJoin([
      this.motorLeadsService.getAll(),
      this.categoriesService.getAll()
    ]).pipe(
      map(([leadsResponse, categoriesResponse]) => {
        const motorLeads = leadsResponse.data;
        const categories = categoriesResponse.data;
        
        // Merge categories into motor leads
        const mergedData = motorLeads.map(lead => ({
          ...lead,
          active_status: this.normalizeActiveStatusService.normalizeActiveStatus(lead.active_status),
          need_call: lead.need_call === 'yes' ? 'yes' : 'no',
          category: categories.find(c => c.id === lead.category_id)
        }));
        
        return {
          motorsLeads: mergedData,
          categories: categories
        };
      })
    );
  }
}