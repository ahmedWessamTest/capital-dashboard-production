import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';

// English Blog Interface
export interface EnglishBlog extends BaseEntity {
  en_blog_title: string;
  en_slug: string;
  en_blog_text: string;
  main_image: string;
  blog_date: string | null;
  en_meta_title: string;
  en_meta_text: string;
  en_first_script_text: string;
  en_second_script_text: string;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type EnglishBlogsListResponse = ApiResponse<EnglishBlog[]>;
export type EnglishBlogResponse = ApiResponse<EnglishBlog>;

// DTOs
export interface EnglishBlogFormData {
  en_blog_title: string;
  en_blog_text: string;
  en_meta_title: string;
  en_meta_text: string;
  en_first_script_text: string;
  en_second_script_text: string;
  blog_date?: string | null;
  main_image?: File;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class EnglishBlogsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'blogs-english'; // Assuming endpoint is blogs-english

  constructor(private http: HttpClient) { }

  getAll(): Observable<EnglishBlogsListResponse> {
    return this.http.get<EnglishBlogsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<EnglishBlogResponse> {
    return this.http.get<EnglishBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: EnglishBlogFormData): Observable<EnglishBlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<EnglishBlogResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<EnglishBlogFormData>): Observable<EnglishBlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<EnglishBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<EnglishBlogResponse> {
    return this.http.post<EnglishBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<EnglishBlogResponse> {
    return this.http.post<EnglishBlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<EnglishBlogFormData>): FormData {
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