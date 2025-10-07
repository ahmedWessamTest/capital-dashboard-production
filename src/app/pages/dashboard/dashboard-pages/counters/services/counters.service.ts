import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';
import { ApiResponse } from '../../../../../shared/service/genereic-table.service';

export interface AboutCounter extends BaseEntity {
  en_name: string;
  ar_name: string;
  counter_value: string;
  active_status: boolean;
  created_at: string;
  updated_at: string;
}

export type AboutCountersListResponse = ApiResponse<AboutCounter[]>;
export type AboutCounterResponse = ApiResponse<AboutCounter>;

export interface AboutCounterFormData {
  en_name: string;
  ar_name: string;
  counter_value: string;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutCountersService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'about-counters';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AboutCountersListResponse> {
    return this.http.get<AboutCountersListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<AboutCounterResponse> {
    return this.http.get<AboutCounterResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  update(id: number, data: Partial<AboutCounterFormData>): Observable<AboutCounterResponse> {
    return this.http.put<AboutCounterResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }
}