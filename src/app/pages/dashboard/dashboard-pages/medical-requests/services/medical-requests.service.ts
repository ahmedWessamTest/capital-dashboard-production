import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';

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

export interface MedicalInsurance {
  id: number;
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  active_status: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRequest {
  id: number | string;
  user_id: number;
  category_id: number;
  medical_insurance_id: number;
  payment_method: string;
  medical_insurance_number: string;
  admin_medical_insurance_number: string;
  active_status: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string;
  start_date: string;
  duration: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user?: User;
  comments?: Comment[];
  category?: Category;
  medical_insurance?: MedicalInsurance;
  request_type: string;
  company_employee_number: number;
}

export type MedicalRequestsListResponse = ApiResponse<MedicalRequest[]>;
export type MedicalRequestResponse = ApiResponse<MedicalRequest>;

export interface MedicalRequestFormData {
  user_id: number | string;
  category_id: number | string;
  medical_insurance_id: number | string;
  payment_method: string;
  medical_insurance_number: string;
  admin_medical_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  gender: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRequestsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'medical-requests';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MedicalRequestsListResponse> {
    return this.http.get<MedicalRequestsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<MedicalRequestResponse> {
    console.log(id);
    console.log(`${this.baseUrl}${this.endpoint}/${id}`);
    return this.http.get<MedicalRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: MedicalRequestFormData): Observable<MedicalRequestResponse> {
    return this.http.post<MedicalRequestResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<MedicalRequestFormData>): Observable<MedicalRequestResponse> {
    return this.http.put<MedicalRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  cancel(id: number | string): Observable<MedicalRequestResponse> {
    return this.http.post<MedicalRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, { active_status: 'cancelled' });
  }

  confirm(id: number | string, activeStatus: string): Observable<MedicalRequestResponse> {
    return this.http.post<MedicalRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, { active_status: activeStatus });
  }
}
