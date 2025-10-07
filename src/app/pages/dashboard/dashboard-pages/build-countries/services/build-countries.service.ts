import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface BuildCountry extends BaseEntity {
  build_type_id: number;
  en_title: string;
  ar_title: string;
  created_at: string;
  updated_at: string;
}

export type BuildCountriesListResponse = ApiResponse<BuildCountry[]>;
export type BuildCountryResponse = ApiResponse<BuildCountry>;

export interface BuildCountryFormData {
  build_type_id: number | string;
  en_title: string;
  ar_title: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildCountriesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'build-countries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BuildCountriesListResponse> {
    return this.http.get<BuildCountriesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<BuildCountryResponse> {
    return this.http.get<BuildCountryResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: BuildCountryFormData): Observable<BuildCountryResponse> {
    return this.http.post<BuildCountryResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<BuildCountryFormData>): Observable<BuildCountryResponse> {
    return this.http.put<BuildCountryResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<BuildCountryResponse> {
    return this.http.post<BuildCountryResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<BuildCountryResponse> {
    return this.http.post<BuildCountryResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}