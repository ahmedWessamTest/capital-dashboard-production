import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { BuildingInsurance } from '../../property-insurance/services/property-insurance.service';

export interface User {
  id: number;
  apple_id: string | null;
  google_id: string | null;
  name: string;
  phone: string | null;
  gender: string;
  birth_date: string | null;
  email: string;
  email_verified_at: string | null;
  role: string;
  admin_status: number;
  active_status: number;
  active_code: string | null;
  forget_code: string | null;
  deactive_status: number;
  delete_status: number;
  device_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  comment_file: string | null;
  comment_date: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  request_id: number;
  request_status: string;
  created_at: string;
  updated_at: string;
}

export interface BuildingRequest {
  id: number | string;
  user_id: number;
  category_id: number;
  building_insurance_id: number;
  payment_method: string;
  building_insurance_number: string;
  admin_building_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string;
  building_type_id: number;
  building_type: string;
  building_country_id: number;
  building_country: string;
  building_city: string;
  building_price: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  comments?: Comment[];
  category?: Category;
  building_insurance?: BuildingInsurance;
  request_type?: string;
  company_building_number: number;
  company_building_total_money?: number;
}

export type BuildingRequestsListResponse = ApiResponse<BuildingRequest[]>;
export type BuildingRequestResponse = ApiResponse<BuildingRequest>;

export interface BuildingRequestFormData {
  user_id: number | string;
  category_id: number | string;
  building_insurance_id: number | string;
  payment_method: string;
  building_insurance_number: string;
  admin_building_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  gender: string;
  building_type_id: number | string;
  building_type: string;
  building_country_id: number | string;
  building_country: string;
  building_city: string;
  building_price: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingRequestsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'building-requests';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BuildingRequestsListResponse> {
    return this.http.get<BuildingRequestsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<BuildingRequestResponse> {
    return this.http.get<BuildingRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: BuildingRequestFormData): Observable<BuildingRequestResponse> {
    return this.http.post<BuildingRequestResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<BuildingRequestFormData>): Observable<BuildingRequestResponse> {
    return this.http.put<BuildingRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  cancel(id: number | string): Observable<BuildingRequestResponse> {
    return this.http.post<BuildingRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, { active_status: 'canceled' });
  }

  changeStatus(id: number | string, activeStatus: string): Observable<BuildingRequestResponse> {
    return this.http.post<BuildingRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, { active_status: activeStatus });
  }
}
