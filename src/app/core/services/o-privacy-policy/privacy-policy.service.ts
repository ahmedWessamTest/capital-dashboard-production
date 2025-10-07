import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

export interface IPrivacyPolicyData {
  success: boolean;
  message: string;
  data: {
    id: number;
    en_title: string;
    ar_title: string;
    en_description: string;
    ar_description: string;
    created_at: string;
    updated_at: string;
  };
}

export interface IPrivacyPolicyUpdateResponse {
  success: boolean;
  message: string;
  data: IPrivacyPolicyData['data'];
}

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {
  private baseUrl = WEB_SITE_BASE_URL; // Replace with actual base URL

  constructor(private http: HttpClient) {}

  getPrivacyPolicy(): Observable<IPrivacyPolicyData> {
    return this.http.get<IPrivacyPolicyData>(`${this.baseUrl}privacy-policy`);
  }

  updatePrivacyPolicy(formData: FormData): Observable<IPrivacyPolicyUpdateResponse> {
    return this.http.post<IPrivacyPolicyUpdateResponse>(`${this.baseUrl}privacy-policy`, formData);
  }
}