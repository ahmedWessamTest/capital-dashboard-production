import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface CarBrand extends BaseEntity {
  car_type_id: number;
  en_title: string;
  ar_title: string;
  created_at: string;
  updated_at: string;
  car_type?: {
    id: number;
    en_title: string;
    ar_title: string;
    created_at: string;
    updated_at: string;
  };
}

export type CarBrandsListResponse = ApiResponse<CarBrand[]>;
export type CarBrandResponse = ApiResponse<CarBrand>;

export interface CarBrandFormData {
  car_type_id: number | string;
  en_title: string;
  ar_title: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarBrandsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'car-brands';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CarBrandsListResponse> {
    return this.http.get<CarBrandsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<CarBrandResponse> {
    return this.http.get<CarBrandResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: FormData): Observable<CarBrandResponse> {
    return this.http.post<CarBrandResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: FormData): Observable<CarBrandResponse> {
    return this.http.post<CarBrandResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<CarBrandResponse> {
    return this.http.post<CarBrandResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<CarBrandResponse> {
    return this.http.post<CarBrandResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}