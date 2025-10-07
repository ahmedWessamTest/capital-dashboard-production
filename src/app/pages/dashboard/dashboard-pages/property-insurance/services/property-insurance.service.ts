import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { Category } from '../../categories/services/categories.service';
import { BuildingInsuranceChoice, BuildingInsuranceChoicesListResponse } from '../../property-insurances-choices/services/property-insurances-choices.service';

export interface BuildingInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  buildingchoices?: BuildingInsuranceChoice[];
}

export type BuildingInsurancesListResponse = ApiResponse<BuildingInsurance[]>;
export type BuildingInsuranceResponse = ApiResponse<BuildingInsurance>;

export interface BuildingInsuranceFormData {
  category_id: number | string;
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
export class BuildingInsurancesService {
  private baseUrl = `${WEB_SITE_BASE_URL}building-insurances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BuildingInsurancesListResponse> {
    return this.http.get<BuildingInsurancesListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<BuildingInsuranceResponse> {
    return this.http.get<BuildingInsuranceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<BuildingInsuranceResponse> {
    return this.http.post<BuildingInsuranceResponse>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<BuildingInsuranceResponse> {
    return this.http.put<BuildingInsuranceResponse>(`${this.baseUrl}/${id}`, data);
  }

  disable(id: number): Observable<BuildingInsuranceResponse> {
    return this.http.post<BuildingInsuranceResponse>(`${this.baseUrl}/${id}/delete`, {});
  }

  enable(id: number): Observable<BuildingInsuranceResponse> {
    return this.http.post<BuildingInsuranceResponse>(`${this.baseUrl}/${id}/recover`, {});
  }

  getChoicesForInsurance(insuranceId: number): Observable<BuildingInsuranceChoice[]> {
    return this.http.get<BuildingInsuranceChoicesListResponse>(`${WEB_SITE_BASE_URL}building-insurance-choices`).pipe(
      map(response => response.data.filter(choice => choice.building_insurance_id === insuranceId))
    );
  }
}