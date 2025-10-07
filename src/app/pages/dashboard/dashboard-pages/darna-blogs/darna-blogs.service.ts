import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Blog Interface
export interface Blog {
  id: number;
  en_blog_title: string;
  ar_blog_title: string;
  en_blog_text: string;
  ar_blog_text: string;
  main_image: string;
  en_alt_image: string;
  ar_alt_image: string | null;
  en_slug: string;
  ar_slug: string;
  blog_date: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  en_first_script_text: string;
  ar_first_script_text: string;
  en_second_script_text: string;
  ar_second_script_text: string;
  active_status: string;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type BlogsListResponse = ApiResponse<Blog[]>;
export type BlogResponse = ApiResponse<Blog>;

// DTOs
export interface BlogFormData {
  en_blog_title: string;
  ar_blog_title: string;
  en_blog_text: string;
  ar_blog_text: string;
  en_alt_image: string;
  ar_alt_image: string | null;
  en_slug: string;
  ar_slug: string;
  blog_date: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  en_first_script_text: string;
  ar_first_script_text: string;
  en_second_script_text: string;
  ar_second_script_text: string;
  active_status: number | string;
  main_image?: File;
}

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private baseUrl = 'https://digitalbondmena.com/darnaapi/api/';
  private endpoint = 'blogs';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BlogsListResponse> {
    return this.http.get<BlogsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: BlogFormData): Observable<BlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<BlogResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<BlogFormData>): Observable<BlogResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<BlogResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<BlogFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'main_image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value?.toString() ?? '');
        }
      }
    });

    return formData;
  }
}