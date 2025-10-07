import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface CarModel extends BaseEntity {
  car_brand_id: number;
  en_title: string;
  ar_title: string;
  created_at: string;
  updated_at: string;
  car_brand?: {
    id: number;
    car_type_id: number;
    en_title: string;
    ar_title: string;
    active_status: string;
    created_at: string;
    updated_at: string;
  };
}

export type CarModelsListResponse = ApiResponse<CarModel[]>;
export type CarModelResponse = ApiResponse<CarModel>;

export interface CarModelFormData {
  car_brand_id: number | string;
  en_title: string;
  ar_title: string;
  active_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarModelsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'car-models';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CarModelsListResponse> {
    return this.http.get<CarModelsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<CarModelResponse> {
    return this.http.get<CarModelResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: FormData): Observable<CarModelResponse> {
    return this.http.post<CarModelResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data:FormData): Observable<CarModelResponse> {
    return this.http.post<CarModelResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<CarModelResponse> {
    return this.http.post<CarModelResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<CarModelResponse> {
    return this.http.post<CarModelResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}