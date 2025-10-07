import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface CarType extends BaseEntity {
  en_title: string;
  ar_title: string;
  created_at: string;
  updated_at: string;
}

export type CarTypesListResponse = ApiResponse<CarType[]>;
export type CarTypeResponse = ApiResponse<CarType>;

export interface CarTypeFormData {
  en_title: string;
  ar_title: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarTypesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'car-types';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CarTypesListResponse> {
    return this.http.get<CarTypesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<CarTypeResponse> {
    return this.http.get<CarTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: CarTypeFormData): Observable<CarTypeResponse> {
    return this.http.post<CarTypeResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<CarTypeFormData>): Observable<CarTypeResponse> {
    return this.http.put<CarTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<CarTypeResponse> {
    return this.http.post<CarTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<CarTypeResponse> {
    return this.http.post<CarTypeResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}