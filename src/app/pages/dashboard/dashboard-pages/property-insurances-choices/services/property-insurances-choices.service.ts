import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { BuildingInsurance } from '../../property-insurance/services/property-insurance.service';

export interface BuildingInsuranceChoice extends BaseEntity {
  category_id: number;
  building_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  buildinginsurance?: BuildingInsurance;
}

export type BuildingInsuranceChoicesListResponse = ApiResponse<BuildingInsuranceChoice[]>;
export type BuildingInsuranceChoiceResponse = ApiResponse<BuildingInsuranceChoice>;

export interface BuildingInsuranceChoiceFormData {
  category_id: number | string;
  building_insurance_id: number | string;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingInsuranceChoicesService {
  private baseUrl = `${WEB_SITE_BASE_URL}building-insurance-choices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BuildingInsuranceChoicesListResponse> {
    return this.http.get<BuildingInsuranceChoicesListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<BuildingInsuranceChoiceResponse> {
    return this.http.get<BuildingInsuranceChoiceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<BuildingInsuranceChoiceResponse> {
    return this.http.post<BuildingInsuranceChoiceResponse>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<BuildingInsuranceChoiceResponse> {
    return this.http.put<BuildingInsuranceChoiceResponse>(`${this.baseUrl}/${id}`, data);
  }

  disable(id: number): Observable<BuildingInsuranceChoiceResponse> {
    return this.http.post<BuildingInsuranceChoiceResponse>(`${this.baseUrl}/${id}/delete`, {});
  }

  enable(id: number): Observable<BuildingInsuranceChoiceResponse> {
    return this.http.post<BuildingInsuranceChoiceResponse>(`${this.baseUrl}/${id}/recover`, {});
  }
}