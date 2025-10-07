// medical-leads-with-categories.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalLeadsService } from '../../pages/dashboard/dashboard-pages/medical-leads/services/medical-leads.service';
import { CategoriesService } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalLeadsWithCategoriesResolver implements Resolve<any> {
  constructor(
    private medicalLeadsService: MedicalLeadsService,
    private categoriesService: CategoriesService,
    private normalizeActiveStatusService: NormalizeActiveStatusService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.ngxSpinnerService.show('actionsLoader');
    
    return forkJoin([
      this.medicalLeadsService.getAll(),
      this.categoriesService.getAll()
    ]).pipe(
      map(([leadsResponse, categoriesResponse]) => {
        const medicalLeads = leadsResponse.data;
        const categories = categoriesResponse.data;
        
        // Merge categories into medical leads
        const mergedData = medicalLeads.map(lead => ({
          ...lead,
          active_status: this.normalizeActiveStatusService.normalizeActiveStatus(lead.active_status),
          need_call: lead.need_call ,
          category: categories.find(c => c.id === lead.category_id)
        }));
        
        return {
          medicalLeads: mergedData,
          categories: categories
        };
      })
    );
  }
}