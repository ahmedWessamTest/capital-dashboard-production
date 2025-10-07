import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';

// Arabic Blog Interface
export interface ArabicBlog extends BaseEntity {
  ar_blog_title: string;
  ar_slug: string;
  ar_blog_text: string;
  main_image: string;
  blog_date: string | null;
  ar_meta_title: string;
  ar_meta_text: string;
  ar_first_script_text: string;
  ar_second_script_text: string;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ArabicBlogsListResponse = ApiResponse<ArabicBlog[]>;
export type ArabicBlogResponse = ApiResponse<ArabicBlog>;

// DTOs
export interface ArabicBlogFormData {
  ar_blog_title: string;
  ar_blog_text: string;
  ar_meta_title: string;
  ar_meta_text: string;
  ar_first_script_text: string;
  ar_second_script_text: string;
  blog_date?: string | null;
  main_image?: File;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class ArabicBlogsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'blogs-arabic';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ArabicBlogsListResponse> {
    return this.http.get<ArabicBlogsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<ArabicBlogResponse> {
    return this.http.get<ArabicBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: ArabicBlogFormData): Observable<ArabicBlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<ArabicBlogResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<ArabicBlogFormData>): Observable<ArabicBlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<ArabicBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<ArabicBlogResponse> {
    return this.http.post<ArabicBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<ArabicBlogResponse> {
    return this.http.post<ArabicBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<ArabicBlogFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'main_image' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'main_image') {
          formData.append(key, value?.toString() ?? '');
        }
      }
    });

    return formData;
  }
}