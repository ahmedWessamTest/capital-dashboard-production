import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface ContactForm extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export type ContactFormsListResponse = ApiResponse<ContactForm[]>;
export type ContactFormResponse = ApiResponse<ContactForm>;

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactUsFormService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'contact-us-form';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContactFormsListResponse> {
    return this.http.get<ContactFormsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<ContactFormResponse> {
    return this.http.get<ContactFormResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: ContactFormData): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  update(id: number, data: Partial<ContactFormData>): Observable<ContactFormResponse> {
    return this.http.put<ContactFormResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  disable(id: number): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}