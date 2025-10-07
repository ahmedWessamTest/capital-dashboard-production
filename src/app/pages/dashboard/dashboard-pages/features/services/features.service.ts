import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface Feature extends BaseEntity {
  en_description: string;
  ar_description: string;
  created_at: string;
  updated_at: string;
}

export type FeaturesListResponse = ApiResponse<Feature[]>;
export type FeatureResponse = ApiResponse<Feature>;
export interface FeatureFormData {
  en_description: string;
  ar_description: string;
  active_status: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'features';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeaturesListResponse> {
    return this.http.get<FeaturesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<FeatureResponse> {
    return this.http.get<FeatureResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: FeatureFormData): Observable<FeatureResponse> {
    return this.http.post<FeatureResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<FeatureFormData>): Observable<FeatureResponse> {
    return this.http.put<FeatureResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<FeatureResponse> {
    return this.http.post<FeatureResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<FeatureResponse> {
    return this.http.post<FeatureResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}