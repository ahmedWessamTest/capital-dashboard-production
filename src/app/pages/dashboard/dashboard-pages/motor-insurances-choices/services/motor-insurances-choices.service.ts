import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';

export interface MotorInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface MotorInsuranceChoice extends BaseEntity {
  category_id: number;
  motor_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  motorinsurance?: MotorInsurance;
}

export type MotorInsuranceChoicesListResponse = ApiResponse<MotorInsuranceChoice[]>;
export type MotorInsuranceChoiceResponse = ApiResponse<MotorInsuranceChoice>;

export interface MotorInsuranceChoiceFormData {
  category_id: number | string;
  motor_insurance_id: number | string;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotorInsuranceChoicesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'motor-insurance-choices';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorInsuranceChoicesListResponse> {
    return this.http.get<MotorInsuranceChoicesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<MotorInsuranceChoiceResponse> {
    return this.http.get<MotorInsuranceChoiceResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: MotorInsuranceChoiceFormData): Observable<MotorInsuranceChoiceResponse> {
    return this.http.post<MotorInsuranceChoiceResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<MotorInsuranceChoiceFormData>): Observable<MotorInsuranceChoiceResponse> {
    return this.http.put<MotorInsuranceChoiceResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<MotorInsuranceChoiceResponse> {
    return this.http.post<MotorInsuranceChoiceResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<MotorInsuranceChoiceResponse> {
    return this.http.post<MotorInsuranceChoiceResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}