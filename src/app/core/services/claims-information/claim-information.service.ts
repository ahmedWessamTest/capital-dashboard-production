import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

export interface ClaimInfo extends BaseEntity {
  en_main_title: string;
  ar_main_title: string;
  en_main_text: string;
  ar_main_text: string;
  main_image: string;
  en_second_title: string;
  ar_second_title: string;
  en_second_text: string;
  ar_second_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  created_at: string;
  updated_at: string;
}

export type ClaimInfoResponse = ApiResponse<ClaimInfo>;

export interface ClaimInfoFormData {
  en_main_title: string;
  ar_main_title: string;
  en_main_text: string;
  ar_main_text: string;
  main_image: string | File;
  en_second_title: string;
  ar_second_title: string;
  en_second_text: string;
  ar_second_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimInfoService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'claim-info';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClaimInfoResponse> {
    return this.http.get<ClaimInfoResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  update(id: number, data: FormData): Observable<ClaimInfoResponse> {
    return this.http.post<ClaimInfoResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }
}