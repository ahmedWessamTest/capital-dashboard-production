import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';

export interface BuildingLead extends BaseEntity {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string | null;
  birth_date?: string | null;
  building_type_id?: number | null;
  building_type?: string | null;
  building_country_id?: number | null;
  building_country?: string | null;
  building_city?: string | null;
  building_price?: string | null;
  need_call?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  lead_type?: string;
}

export type BuildingLeadsListResponse = ApiResponse<BuildingLead[]>;
export type BuildingLeadResponse = ApiResponse<BuildingLead>;

export interface BuildingLeadFormData {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  building_type_id?: number;
  building_country_id?: number;
  building_city?: string;
  building_price?: string;
  need_call?: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingLeadsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'building-leads';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BuildingLeadsListResponse> {
    return this.http.get<BuildingLeadsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<BuildingLeadResponse> {
    return this.http.get<BuildingLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: BuildingLeadFormData): Observable<BuildingLeadResponse> {
    return this.http.post<BuildingLeadResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<BuildingLeadFormData>): Observable<BuildingLeadResponse> {
    return this.http.put<BuildingLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<BuildingLeadResponse> {
    return this.http.post<BuildingLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<BuildingLeadResponse> {
    return this.http.post<BuildingLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}
