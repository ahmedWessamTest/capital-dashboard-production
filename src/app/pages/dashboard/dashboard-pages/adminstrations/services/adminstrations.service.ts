import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';

export interface Administration extends BaseEntity {
  en_name: string;
  ar_name: string;
  en_job: string;
  ar_job: string;
  admin_image: string;
  created_at: string;
  updated_at: string;
}

export type AdministrationsListResponse = ApiResponse<Administration[]>;
export type AdministrationResponse = ApiResponse<Administration>;
export interface AdministrationFormData {
  en_name: string;
  ar_name: string;
  en_job: string;
  ar_job: string;
  admin_image?: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class AdministrationsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'adminstrations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdministrationsListResponse> {
    return this.http.get<AdministrationsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<AdministrationResponse> {
    return this.http.get<AdministrationResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: AdministrationFormData): Observable<AdministrationResponse> {
    return this.http.post<AdministrationResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data:FormData): Observable<AdministrationResponse> {
    return this.http.post<AdministrationResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<AdministrationResponse> {
    return this.http.post<AdministrationResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<AdministrationResponse> {
    return this.http.post<AdministrationResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}