import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';
import { ApiResponse } from '../../../../../shared/service/genereic-table.service';
import { Category } from '../../categories/services/categories.service';


export interface Partner extends BaseEntity {
  category_id: number;
  en_partner_name: string;
  ar_partner_name: string;
  partner_image: string;
  active_status: boolean;
  created_at: string;
  updated_at: string;
  category?: Category; // Optional embedded category object
}

// Response types
export type PartnersListResponse = ApiResponse<Partner[]>;
export type PartnerResponse = ApiResponse<Partner>;

// Form data interface
export interface PartnerFormData {
  category_id: number;
  en_partner_name: string;
  ar_partner_name: string;
  partner_image: File | string; // Use File during upload, string when editing existing image path
  active_status: number | string;
}
@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'partners';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PartnersListResponse> {
    return this.http.get<PartnersListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<PartnerResponse> {
    return this.http.get<PartnerResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: PartnerFormData): Observable<PartnerResponse> {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof PartnerFormData];
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    }

    return this.http.post<PartnerResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<PartnerFormData>): Observable<PartnerResponse> {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof PartnerFormData];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }
    }

    return this.http.put<PartnerResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<PartnerResponse> {
    return this.http.post<PartnerResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<PartnerResponse> {
    return this.http.post<PartnerResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }
}