import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';
import { ApiResponse } from '../../../../../shared/service/genereic-table.service';

export interface Category extends BaseEntity {
  en_title: string;
  ar_title: string;
  en_slug: string;
  ar_slug: string;
  en_small_description: string;
  ar_small_description: string;
  en_main_description: string;
  ar_main_description: string;
  network_link: string;
  counter_number: number;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  created_at: string;
  updated_at: string;
}

export type CategoriesListResponse = ApiResponse<Category[]>;
export type CategoryResponse = ApiResponse<Category>;
export interface CategoryFormData {
  en_title: string;
  ar_title: string;
  en_slug: string;
  ar_slug: string;
  en_small_description: string;
  ar_small_description: string;
  en_main_description: string;
  ar_main_description: string;
  network_link: string;
  counter_number: number;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  active_status: number | string;
  ar_first_script?: string;
  en_first_script?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriesListResponse> {
    return this.http.get<CategoriesListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: CategoryFormData): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<CategoryFormData>): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}