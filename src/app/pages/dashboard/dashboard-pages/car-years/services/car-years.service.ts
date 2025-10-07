import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface CarYear extends BaseEntity {
  car_model_id: number;
  year_date: string;
  created_at: string;
  updated_at: string;
  car_model?: {
    id: number;
    car_brand_id: number;
    en_title: string;
    ar_title: string;
    active_status: string;
    created_at: string;
    updated_at: string;
  };
}

export type CarYearsListResponse = ApiResponse<CarYear[]>;
export type CarYearResponse = ApiResponse<CarYear>;

export interface CarYearFormData {
  car_model_id: number | string;
  year_date: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarYearsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'car-years';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CarYearsListResponse> {
    return this.http.get<CarYearsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<CarYearResponse> {
    return this.http.get<CarYearResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data:FormData): Observable<CarYearResponse> {
    return this.http.post<CarYearResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data:FormData): Observable<CarYearResponse> {
    return this.http.post<CarYearResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<CarYearResponse> {
    return this.http.post<CarYearResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<CarYearResponse> {
    return this.http.post<CarYearResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}