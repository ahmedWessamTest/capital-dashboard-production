// medical-leads-with-categories.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalLeadsService } from '../../pages/dashboard/dashboard-pages/medical-leads/services/medical-leads.service';
import { CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { BuildingLeadsService } from '../../pages/dashboard/dashboard-pages/building-lead/services/building-lead.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingLeadsWithCategoriesResolver implements Resolve<any> {
  constructor(
    private buildingLeadsService: BuildingLeadsService,
    private categoriesService: CategoriesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.ngxSpinnerService.show('actionsLoader');
    
    return forkJoin([
      this.buildingLeadsService.getAll(),
      this.categoriesService.getAll()
    ]).pipe(
      map(([leadsResponse, categoriesResponse]) => {
        const buildingLeads = leadsResponse.data;
        const categories = categoriesResponse.data;
        
        // Merge categories into building leads
        const mergedData = buildingLeads.map(lead => ({
          ...lead,
          active_status: this.normalizeActiveStatusService.normalizeActiveStatus(lead.active_status),
          need_call: lead.need_call === 'yes' ? 'yes' : 'no',
          category: categories.find(c => c.id === lead.category_id)
        }));
        
        return {
          buildingLeads: mergedData,
          categories: categories
        };
      })
    );
  }
}