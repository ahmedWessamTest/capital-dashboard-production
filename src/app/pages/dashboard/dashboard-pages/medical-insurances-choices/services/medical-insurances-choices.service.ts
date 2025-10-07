import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { MedicalInsurance } from '../../medical-insurances/services/medical-insurances.service';

export interface MedicalInsuranceChoice extends BaseEntity {
  category_id: number;
  medical_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  medicalinsurance?: MedicalInsurance;
}

export type MedicalInsuranceChoicesListResponse = ApiResponse<MedicalInsuranceChoice[]>;
export type MedicalInsuranceChoiceResponse = ApiResponse<MedicalInsuranceChoice>;

export interface MedicalInsuranceChoiceFormData {
  category_id: number | string;
  medical_insurance_id: number | string;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalInsuranceChoicesService {
  private baseUrl = `${WEB_SITE_BASE_URL}medical-insurance-choices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicalInsuranceChoicesListResponse> {
    return this.http.get<MedicalInsuranceChoicesListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<MedicalInsuranceChoiceResponse> {
    return this.http.get<MedicalInsuranceChoiceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: MedicalInsuranceChoiceFormData): Observable<MedicalInsuranceChoiceResponse> {
    return this.http.post<MedicalInsuranceChoiceResponse>(this.baseUrl, data);
  }

  update(id: number, data: Partial<MedicalInsuranceChoiceFormData>): Observable<MedicalInsuranceChoiceResponse> {
    return this.http.put<MedicalInsuranceChoiceResponse>(`${this.baseUrl}/${id}`, data);
  }

  disable(id: number): Observable<MedicalInsuranceChoiceResponse> {
    return this.http.post<MedicalInsuranceChoiceResponse>(`${this.baseUrl}/${id}/delete`, {});
  }

  enable(id: number): Observable<MedicalInsuranceChoiceResponse> {
    return this.http.post<MedicalInsuranceChoiceResponse>(`${this.baseUrl}/${id}/recover`, {});
  }
}