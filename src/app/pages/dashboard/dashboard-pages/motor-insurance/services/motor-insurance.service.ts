import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { MotorInsuranceChoice, MotorInsuranceChoicesListResponse } from '../../motor-insurances-choices/services/motor-insurances-choices.service';

export interface MotorInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  motorchoices?: MotorInsuranceChoice[];
}

export type MotorInsurancesListResponse = ApiResponse<MotorInsurance[]>;
export type MotorInsuranceResponse = ApiResponse<MotorInsurance>;

export interface MotorInsuranceFormData {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotorInsurancesService {
  private baseUrl = `${WEB_SITE_BASE_URL}motor-insurances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorInsurancesListResponse> {
    return this.http.get<MotorInsurancesListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<MotorInsuranceResponse> {
    return this.http.get<MotorInsuranceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<MotorInsuranceResponse> {
    return this.http.post<MotorInsuranceResponse>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<MotorInsuranceResponse> {
    return this.http.put<MotorInsuranceResponse>(`${this.baseUrl}/${id}`, data);
  }

  disable(id: number): Observable<MotorInsuranceResponse> {
    return this.http.post<MotorInsuranceResponse>(`${this.baseUrl}/${id}/delete`, {});
  }

  enable(id: number): Observable<MotorInsuranceResponse> {
    return this.http.post<MotorInsuranceResponse>(`${this.baseUrl}/${id}/recover`, {});
  }

  // Helper method to get choices for a specific insurance
  getChoicesForInsurance(insuranceId: number): Observable<MotorInsuranceChoice[]> {
    return this.http.get<MotorInsuranceChoicesListResponse>(`${WEB_SITE_BASE_URL}motor-insurance-choices`).pipe(
      map(response => response.data.filter(choice => choice.motor_insurance_id === insuranceId))
    );
  }
}