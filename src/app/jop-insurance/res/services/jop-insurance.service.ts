import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../core/constants/WEB_SITE_BASE_UTL';
import { GetAllJop, IJopInsurance } from '../interface/getAllJop';

@Injectable({
  providedIn: 'root',
})
export class JopInsurancesService {
  private baseUrl = `${WEB_SITE_BASE_URL}jop-insurances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GetAllJop> {
    return this.http.get<GetAllJop>(this.baseUrl);
  }

  getById(id: number): Observable<IJopInsurance> {
    return this.http.get<IJopInsurance>(`${this.baseUrl}/${id}`);
  }

  // create(data: FormData): Observable<MotorInsuranceResponse> {
  //   return this.http.post<MotorInsuranceResponse>(this.baseUrl, data);
  // }

  update(id: number, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // disable(id: number): Observable<MotorInsuranceResponse> {
  //   return this.http.post<MotorInsuranceResponse>(`${this.baseUrl}/${id}/delete`, {});
  // }

  // enable(id: number): Observable<MotorInsuranceResponse> {
  //   return this.http.post<MotorInsuranceResponse>(`${this.baseUrl}/${id}/recover`, {});
  // }

  // // Helper method to get choices for a specific insurance
  // getChoicesForInsurance(insuranceId: number): Observable<MotorInsuranceChoice[]> {
  //   return this.http.get<MotorInsuranceChoicesListResponse>(`${WEB_SITE_BASE_URL}motor-insurance-choices`).pipe(
  //     map(response => response.data.filter(choice => choice.motor_insurance_id === insuranceId))
  //   );
  // }
}
