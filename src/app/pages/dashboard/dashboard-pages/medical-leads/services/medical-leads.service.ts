import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';

export interface MedicalLead extends BaseEntity {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string | null;
  birth_date?: string | null;
  need_call?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  lead_type?: string;
}

export type MedicalLeadsListResponse = ApiResponse<MedicalLead[]>;
export type MedicalLeadResponse = ApiResponse<MedicalLead>;
export interface MedicalLeadFormData {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  need_call?: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalLeadsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'medical-leads';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MedicalLeadsListResponse> {
    return this.http.get<MedicalLeadsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<MedicalLeadResponse> {
    return this.http.get<MedicalLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: MedicalLeadFormData): Observable<MedicalLeadResponse> {
    return this.http.post<MedicalLeadResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<MedicalLeadFormData>): Observable<MedicalLeadResponse> {
    return this.http.put<MedicalLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<MedicalLeadResponse> {
    return this.http.post<MedicalLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<MedicalLeadResponse> {
    return this.http.post<MedicalLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}
