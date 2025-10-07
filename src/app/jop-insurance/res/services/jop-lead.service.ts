import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../core/constants/WEB_SITE_BASE_UTL';
import {
  ApiResponse,
  BaseEntity,
} from '../../../shared/service/genereic-table.service';
import { Category } from '../interface/getAllJop';

export interface JopLead extends BaseEntity {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  gender?: string | null;
  jop_title?: string | null;
  jop_price?: number | null;
  jop_main_id?: string | null;
  jop_second_id?: number | null;
  need_call?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  lead_type?: string;
}

export type JopLeadsListResponse = ApiResponse<JopLead[]>;
export type JopLeadResponse = ApiResponse<JopLead>;

export interface JopLeadFormData {
  category_id: number;
  name: string;
  phone: string;
  email?: string;
  jop_title?: string;
  jop_price?: number;
  jop_main_id?: string;
  jop_second_id?: number;
  need_call?: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root',
})
export class JopLeadsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'jop-leads';

  constructor(private http: HttpClient) { }

  getAll(): Observable<JopLeadsListResponse> {
    return this.http.get<JopLeadsListResponse>(
      `${this.baseUrl}${this.endpoint}`
    );
  }

  getById(id: number): Observable<JopLeadResponse> {
    return this.http.get<JopLeadResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  create(data: JopLeadFormData): Observable<JopLeadResponse> {
    return this.http.post<JopLeadResponse>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  update(
    id: number,
    data: Partial<JopLeadFormData>
  ): Observable<JopLeadResponse> {
    return this.http.put<JopLeadResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data
    );
  }

  disable(id: number): Observable<JopLeadResponse> {
    return this.http.post<JopLeadResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/delete`,
      {}
    );
  }

  enable(id: number): Observable<JopLeadResponse> {
    return this.http.post<JopLeadResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/recover`,
      {}
    );
  }
}
