import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import {
  ApiResponse,
  BaseEntity,
} from '../../../../../shared/service/genereic-table.service';
import { IJopPolicy } from '../../a-jop-insurance/jop-insurance';
import { Category } from '../../categories/services/categories.service';

export interface JopInsuranceChoice extends BaseEntity {
  category_id: number;
  jop_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  jopinsurance?: IJopPolicy;
}

export type JopInsuranceChoicesListResponse = ApiResponse<JopInsuranceChoice[]>;
export type JopInsuranceChoiceResponse = ApiResponse<JopInsuranceChoice>;

export interface JopInsuranceChoiceFormData {
  category_id: number | string;
  jop_insurance_id: number | string;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root',
})
export class JopInsuranceChoicesService {
  private baseUrl = `${WEB_SITE_BASE_URL}jop-insurance-choices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<JopInsuranceChoicesListResponse> {
    return this.http.get<JopInsuranceChoicesListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<JopInsuranceChoiceResponse> {
    return this.http.get<JopInsuranceChoiceResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<JopInsuranceChoiceResponse> {
    return this.http.post<JopInsuranceChoiceResponse>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<JopInsuranceChoiceResponse> {
    return this.http.put<JopInsuranceChoiceResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  disable(id: number): Observable<JopInsuranceChoiceResponse> {
    return this.http.post<JopInsuranceChoiceResponse>(
      `${this.baseUrl}/${id}/delete`,
      {}
    );
  }

  enable(id: number): Observable<JopInsuranceChoiceResponse> {
    return this.http.post<JopInsuranceChoiceResponse>(
      `${this.baseUrl}/${id}/recover`,
      {}
    );
  }
}
