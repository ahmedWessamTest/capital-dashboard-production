import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { ApiResponse } from '../../medical-request-comment/services/medical-request-comment.service';

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

export interface JobInsurance {
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

export interface JobRequest {
  id: number | string;
  user_id: number;
  category_id: number;
  jop_insurance_id: number;
  payment_method: string;
  jop_insurance_number: string;
  admin_jop_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string;
  job_title: string;
  company_name: string;
  years_of_experience: number;
  profession_id: number;
  profession_name: string;
  salary: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
  created_at: string;
  updated_at: string;
  jop_main_id: string;
  jop_second_id: string;
  jop_price: string;
  jop_title: string;
  user?: User;
  comments?: Comment[];
  category?: Category;
  jop_insurance?: JobInsurance;
  request_type?: string;
  company_employee_number?: number;
}

export type JobRequestsListResponse = ApiResponse<JobRequest[]>;
export type JobRequestResponse = ApiResponse<JobRequest>;

export interface JobRequestFormData {
  user_id: number | string;
  category_id: number | string;
  jop_insurance_id: number | string;
  payment_method: string;
  jop_insurance_number: string;
  admin_jop_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  gender: string;
  job_title: string;
  company_name: string;
  years_of_experience: number | string;
  profession_id: number | string;
  profession_name: string;
  salary: string;
  start_date: string;
  duration: string;
  end_date: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root',
})
export class JobRequestsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'jop-requests';

  constructor(private http: HttpClient) { }

  getAll(): Observable<JobRequestsListResponse> {
    return this.http.get<JobRequestsListResponse>(
      `${this.baseUrl}${this.endpoint}`
    );
  }

  getById(id: number): Observable<JobRequestResponse> {
    return this.http.get<JobRequestResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  create(data: JobRequestFormData): Observable<JobRequestResponse> {
    return this.http.post<JobRequestResponse>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  update(
    id: number,
    data: Partial<JobRequestFormData>
  ): Observable<JobRequestResponse> {
    return this.http.put<JobRequestResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data
    );
  }

  cancel(id: number | string): Observable<JobRequestResponse> {
    return this.http.post<JobRequestResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/delete`,
      { active_status: 'canceled' }
    );
  }

  changeStatus(
    id: number | string,
    status: string
  ): Observable<JobRequestResponse> {
    return this.http.post<JobRequestResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/recover`,
      { active_status: status }
    );
  }
}
