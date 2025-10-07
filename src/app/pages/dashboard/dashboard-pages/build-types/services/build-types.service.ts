import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface BuildType extends BaseEntity {
  en_title: string;
  ar_title: string;
  created_at: string;
  updated_at: string;
}

export type BuildTypesListResponse = ApiResponse<BuildType[]>;
export type BuildTypeResponse = ApiResponse<BuildType>;

export interface BuildTypeFormData {
  en_title: string;
  ar_title: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildTypesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'build-types';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BuildTypesListResponse> {
    return this.http.get<BuildTypesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<BuildTypeResponse> {
    return this.http.get<BuildTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: BuildTypeFormData): Observable<BuildTypeResponse> {
    return this.http.post<BuildTypeResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<BuildTypeFormData>): Observable<BuildTypeResponse> {
    return this.http.put<BuildTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<BuildTypeResponse> {
    return this.http.post<BuildTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<BuildTypeResponse> {
    return this.http.post<BuildTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}