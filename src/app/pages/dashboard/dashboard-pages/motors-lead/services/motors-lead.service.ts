import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';

export interface MotorLead extends BaseEntity {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string | null;
  birth_date?: string | null;
  need_call?: string | null;
  car_type_id?: number | null;
  car_type?: string | null;
  car_brand_id?: number | null;
  car_brand?: string | null;
  car_model_id?: number | null;
  car_model?: string | null;
  car_year_id?: number | null;
  car_year?: string | null;
  car_price?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export type MotorLeadsListResponse = ApiResponse<MotorLead[]>;
export type MotorLeadResponse = ApiResponse<MotorLead>;

export interface MotorLeadFormData {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  need_call?: string;
  car_type_id?: number;
  car_brand_id?: number;
  car_model_id?: number;
  car_year_id?: number;
  car_price?: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class MotorLeadsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'motor-leads';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorLeadsListResponse> {
    return this.http.get<MotorLeadsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<MotorLeadResponse> {
    return this.http.get<MotorLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: MotorLeadFormData): Observable<MotorLeadResponse> {
    return this.http.post<MotorLeadResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<MotorLeadFormData>): Observable<MotorLeadResponse> {
    return this.http.put<MotorLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<MotorLeadResponse> {
    return this.http.post<MotorLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<MotorLeadResponse> {
    return this.http.post<MotorLeadResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}