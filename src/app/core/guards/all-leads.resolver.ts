import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  JopLead,
  JopLeadsService,
} from '../../jop-insurance/res/services/jop-lead.service';
import {
  BuildingLead,
  BuildingLeadsService,
} from '../../pages/dashboard/dashboard-pages/building-lead/services/building-lead.service';
import {
  MedicalLead,
  MedicalLeadsService,
} from '../../pages/dashboard/dashboard-pages/medical-leads/services/medical-leads.service';
import {
  MotorLead,
  MotorLeadsService,
} from '../../pages/dashboard/dashboard-pages/motors-lead/services/motors-lead.service';
interface CombinedLead {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  phone: string;
  email?: string;
  gender?: string | null;
  birth_date?: string | null;
  need_call?: string | null;
  created_at: string;
  updated_at: string;
  car_type?: string | null;
  car_brand?: string | null;
  car_model?: string | null;
  car_year?: string | null;
  car_price?: string | null;
  building_insurance_number?: string | null;
  building_type?: string | null;
  building_country?: string | null;
  building_city?: string | null;
  building_price?: string | null;
  status?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AllLeadsResolver implements Resolve<any> {
  constructor(
    private medicalLeadsService: MedicalLeadsService,
    private motorLeadsService: MotorLeadsService,
    private buildingLeadsService: BuildingLeadsService,
    private jopLeadsService: JopLeadsService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    this.ngxSpinnerService.show('actionsLoader');
    return forkJoin({
      medicalLeads: this.medicalLeadsService.getAll(),
      motorLeads: this.motorLeadsService.getAll(),
      buildingLeads: this.buildingLeadsService.getAll(),
      jopLeads: this.jopLeadsService.getAll(),
    }).pipe(
      map(({ medicalLeads, motorLeads, buildingLeads, jopLeads }) => {
        const combinedLeads: CombinedLead[] = [
          ...this.mapMedicalLeads(medicalLeads.data),
          ...this.mapMotorLeads(motorLeads.data),
          ...this.mapBuildingLeads(buildingLeads.data),
          ...this.mapJopLeads(jopLeads.data),
        ];
        return { combinedLeads };
      })
    );
  }

  private mapMedicalLeads(leads: MedicalLead[]): CombinedLead[] {
    return leads.map((lead) => ({
      id: lead.id,
      category_id: lead.category_id,
      category_name: 'Medical',
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      lead_type: lead.lead_type,
      need_call: lead.need_call ? lead.need_call.toLowerCase() : 'no',
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    }));
  }

  private mapMotorLeads(leads: MotorLead[]): CombinedLead[] {
    return leads.map((lead) => ({
      id: lead.id,
      category_id: lead.category_id,
      category_name: 'Motor',
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      need_call: lead.need_call ? lead.need_call.toLowerCase() : 'no',
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    }));
  }

  private mapBuildingLeads(leads: BuildingLead[]): CombinedLead[] {
    return leads.map((lead) => ({
      id: lead.id,
      category_id: lead.category_id,
      category_name: 'Building',
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      need_call: lead.need_call ? lead.need_call.toLowerCase() : 'no',
      building_insurance_number: lead['building_insurance_number'],
      lead_type: lead.lead_type,
      created_at: lead['created_at'],
      updated_at: lead['updated_at'],
    }));
  }

  private mapJopLeads(leads: JopLead[]): CombinedLead[] {
    return leads.map((lead) => ({
      id: lead.id,
      category_id: lead.category_id,
      category_name: 'Jop',
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      need_call: lead.need_call ? lead.need_call.toLowerCase() : 'no',
      jop_title: lead.jop_title,
      jop_price: lead.jop_price,
      jop_main_id: lead.jop_main_id,
      jop_second_id: lead.jop_second_id,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
      lead_type: lead.lead_type
    }));
  }
}
