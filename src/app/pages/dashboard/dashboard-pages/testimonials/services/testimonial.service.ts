import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

// Testimonial Interface
export interface Testimonial {
  id: number;
  en_name: string;
  ar_name: string;
  en_job: string;
  ar_job: string;
  en_text: string;
  ar_text: string;
  active_status: number | string;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TestimonialsListResponse = ApiResponse<Testimonial[]>;
export type TestimonialResponse = ApiResponse<Testimonial>;

// DTOs
export interface TestimonialFormData {
  en_name: string;
  ar_name: string;
  en_job: string;
  ar_job: string;
  en_text: string;
  ar_text: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'testimonials';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TestimonialsListResponse> {
    return this.http.get<TestimonialsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<TestimonialResponse> {
    return this.http.get<TestimonialResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: TestimonialFormData): Observable<TestimonialResponse> {
    return this.http.post<TestimonialResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<TestimonialFormData>): Observable<TestimonialResponse> {
    return this.http.put<TestimonialResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<TestimonialResponse> {
    return this.http.post<TestimonialResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<TestimonialResponse> {
    return this.http.post<TestimonialResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}