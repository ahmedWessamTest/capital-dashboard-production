import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {WEB_SITE_BASE_URL} from '../../../../../core/constants/WEB_SITE_BASE_UTL';
// Slider Interface
export interface Slider {
  id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  image: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type SlidersListResponse = ApiResponse<Slider[]>;
export type SliderResponse = ApiResponse<Slider>;

// DTOs
export interface SliderFormData {
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  image?: File;
  active_status: number;
}

@Injectable({
  providedIn: 'root'
})
export class SlidersService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'sliders-log';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SlidersListResponse> {
    return this.http.get<SlidersListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<SliderResponse> {
    return this.http.get<SliderResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: SliderFormData): Observable<SliderResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<SliderResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<SliderFormData>): Observable<SliderResponse> {
    const formData = this.buildFormData(data);
    return this.http.put<SliderResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<SliderResponse> {
    return this.http.post<SliderResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<SliderResponse> {
    return this.http.post<SliderResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<SliderFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'image') {
          formData.append(key, value.toString());
        }
      }
    });

    return formData;
  }
}