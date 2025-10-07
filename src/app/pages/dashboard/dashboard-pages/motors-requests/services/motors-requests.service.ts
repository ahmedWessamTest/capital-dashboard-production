import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../categories/services/categories.service';
import { ApiResponse } from '../../medical-request-comment/services/medical-request-comment.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

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
  user_name?: string;
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

export interface MotorInsurance {
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

export interface MotorRequest {
  id: number | string;
  user_id: number;
  category_id: number;
  motor_insurance_id: number;
  payment_method: string;
  motor_insurance_number: string;
  admin_motor_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string;
  car_type_id: number;
  car_type: string;
  car_brand_id: number;
  car_brand: string;
  car_model_id: number;
  car_model: string;
  car_year_id: number;
  car_year: string;
  car_price: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  comments?: Comment[];
  category?: Category;
  motor_insurance?: MotorInsurance;
  request_type?: string;
}

export type MotorRequestsListResponse = ApiResponse<MotorRequest[]>;
export type MotorRequestResponse = ApiResponse<MotorRequest>;

export interface MotorRequestFormData {
  user_id: number | string;
  category_id: number | string;
  motor_insurance_id: number | string;
  payment_method: string;
  motor_insurance_number: string;
  admin_motor_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  gender: string;
  car_type_id: number | string;
  car_type: string;
  car_brand_id: number | string;
  car_brand: string;
  car_model_id: number | string;
  car_model: string;
  car_year_id: number | string;
  car_year: string;
  car_price: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotorRequestsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'motor-requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorRequestsListResponse> {
    return this.http.get<MotorRequestsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<MotorRequestResponse> {
    return this.http.get<MotorRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: MotorRequestFormData): Observable<MotorRequestResponse> {
    return this.http.post<MotorRequestResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<MotorRequestFormData>): Observable<MotorRequestResponse> {
    return this.http.put<MotorRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  cancel(id: number | string): Observable<MotorRequestResponse> {
    return this.http.post<MotorRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, { active_status: 'canceled' });
  }

  changeStatus(id: number | string, status: string): Observable<MotorRequestResponse> {
    return this.http.post<MotorRequestResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, { active_status: status });
  }
}