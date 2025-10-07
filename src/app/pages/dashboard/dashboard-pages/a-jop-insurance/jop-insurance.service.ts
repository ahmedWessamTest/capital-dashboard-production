import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../core/constants/WEB_SITE_BASE_UTL';
import { IAllJopPolicy, IJopPolicy } from './jop-insurance';

@Injectable({
  providedIn: 'root',
})
export class JopInsuranceService {
  private baseUrl = `${WEB_SITE_BASE_URL}jop-insurances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IAllJopPolicy> {
    return this.http.get<IAllJopPolicy>(this.baseUrl);
  }

  getById(id: number): Observable<IJopPolicy> {
    return this.http.get<IJopPolicy>(`${this.baseUrl}/${id}`);
  }

  create(data: IJopPolicy): Observable<IJopPolicy> {
    return this.http.post<IJopPolicy>(this.baseUrl, data);
  }

  update(id: number, data: IJopPolicy): Observable<IJopPolicy> {
    const formData = new FormData();
    formData.append('en_title', data.en_title);
    formData.append('ar_title', data.en_title);
    formData.append('year_money', data.year_money.toString());
    formData.append('month_money', data.month_money.toString());
    formData.append('company_name', data.company_name);
    formData.append('category_id', '5');
    formData.append('active_status', data.active_status.toString());
    return this.http.put<IJopPolicy>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<IJopPolicy> {
    return this.http.delete<IJopPolicy>(`${this.baseUrl}/${id}`);
  }

  recover(id: number): Observable<IJopPolicy> {
    return this.http.post<IJopPolicy>(`${this.baseUrl}/recover/${id}`, {});
  }

  getRecord(id: number): Observable<IJopPolicy> {
    return this.http.post<IJopPolicy>(`${this.baseUrl}/recover/${id}`, {});
  }

  jopChoices(id: number): Observable<IJopPolicy> {
    return this.http.get<IJopPolicy>(
      `${this.baseUrl}/jop-insurance-choices/${id}`
    );
  }
}
