import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { MedicalInsuranceChoice, MedicalInsuranceChoicesListResponse } from '../../medical-insurances-choices/services/medical-insurances-choices.service';

export interface MedicalInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  medicalchoices?: MedicalInsuranceChoice[];
}

export type MedicalInsurancesListResponse = ApiResponse<MedicalInsurance[]>;
export type MedicalInsuranceResponse = ApiResponse<MedicalInsurance>;

export interface MedicalInsuranceFormData {
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
export class MedicalInsurancesService {
  private baseUrl = `${WEB_SITE_BASE_URL}medical-insurances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicalInsurancesListResponse> {
    return this.http.get<MedicalInsurancesListResponse>(this.baseUrl);
  }

  getById(id: number | string): Observable<MedicalInsuranceResponse> {
    return this.http.get<MedicalInsuranceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<MedicalInsuranceResponse> {
    this.getAll().subscribe((res) => {
      console.log(res);
    })
    return this.http.post<MedicalInsuranceResponse>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<MedicalInsuranceResponse> {
    this.getAll().subscribe((res) => {
      console.log(res);
    })
    return this.http.put<MedicalInsuranceResponse>(`${this.baseUrl}/${id}`, data);
  }

  disable(id: number): Observable<MedicalInsuranceResponse> {
    return this.http.post<MedicalInsuranceResponse>(`${this.baseUrl}/${id}/delete`, {});
  }

  enable(id: number): Observable<MedicalInsuranceResponse> {
    return this.http.post<MedicalInsuranceResponse>(`${this.baseUrl}/${id}/recover`, {});
  }

  // Helper method to get choices for a specific insurance
  getChoicesForInsurance(insuranceId: number): Observable<MedicalInsuranceChoice[]> {
    return this.http.get<MedicalInsuranceChoicesListResponse>(`${WEB_SITE_BASE_URL}medical-insurance-choices`).pipe(
      map(response => response.data.filter(choice => choice.medical_insurance_id === insuranceId))
    );
  }
}