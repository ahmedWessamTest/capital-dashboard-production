import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

export interface JopCategory {
  id: number;
  en_title: string;
  ar_title: string;
  en_slug: string;
  ar_slug: string;
  en_small_description: string;
  ar_small_description: string;
  en_main_description: string;
  ar_main_description: string;
  network_link: string;
  counter_number: number;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  active_status: string;
  created_at: string;
  updated_at: string;
  jopinsurances: JopInsurance[];
}

export interface JopInsurance {
  id: number;
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: number;
  month_money: number;
  company_name: string;
  active_status: number;
  created_at: string;
  updated_at: string;
  jopchoices: JopChoice[];
}

export interface JopChoice {
  id: number;
  category_id: number;
  jop_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

export interface JopPolicyData {
  category_id: string;
  jop_insurance_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  jop_title: string;
  jop_price: string;
  jop_main_id: File | null;
  jop_second_id: File | null;
  active_status: string;
  start_date: string;
  duration:string;
  end_date: string;
}

export interface JopDataResponse {
  category: JopCategory;
  types: any; // According to your response, types is null in this case
}

@Injectable({
  providedIn: 'root',
})
export class JopInsuranceService {
  private _http = inject(HttpClient);
  private baseUrl = WEB_SITE_BASE_URL;

  // Signals for state management
  private jopData = signal<JopDataResponse | null>(null);
  public jopData$ = this.jopData.asReadonly();

  // Methods to organize the data for easier access
  getInsurances(): JopInsurance[] {
    return this.jopData()?.category.jopinsurances || [];
  }

  getActiveInsurances(): JopInsurance[] {
    return this.getInsurances().filter(
      (insurance) => insurance.active_status === 1
    );
  }

  getChoicesByInsurance(insuranceId: number): JopChoice[] {
    const insurance = this.getInsurances().find((i) => i.id === insuranceId);
    return (
      insurance?.jopchoices.filter((choice) => choice.active_status === 1) || []
    );
  }

  // API call to fetch job data
  fetchJopData(): Observable<JopDataResponse> {
    // Add the type parameter as a query parameter
    const params = { type: 'jop' };

    return this._http
      .get<JopDataResponse>(`${this.baseUrl}app-policies/policies-content/5`, {
        params,
      })
      .pipe(
        tap((data) => {
          this.jopData.set(data);
        })
      );
  }

  // API call to submit job policy
  submitJopPolicy(policyData: JopPolicyData): Observable<any> {
    const formData = new FormData();

    // Required fields
    formData.append('category_id', policyData.category_id);
    formData.append('jop_insurance_id', policyData.jop_insurance_id);
    formData.append('user_id', policyData.user_id);
    formData.append('name', policyData.name);
    formData.append('email', policyData.email);
    formData.append('phone', policyData.phone);
    formData.append('jop_title', policyData.jop_title);
    formData.append('jop_price', policyData.jop_price);
    formData.append('active_status', policyData.active_status);

    // Image files
    if (policyData.jop_main_id) {
      formData.append('jop_main_id', policyData.jop_main_id);
    }
    if (policyData.jop_second_id) {
      formData.append('jop_second_id', policyData.jop_second_id);
    }

    return this._http.post(
      `${this.baseUrl}app-policies/policies-jop-store`,
      formData
    );
  }

  // API call to create a job lead
  createJopLead(formData: FormData): Observable<any> {
    // Set default category_id to 5 if not provided
    if (!formData.has('category_id')) {
      formData.append('category_id', '5');
    }

    return this._http.post(`${this.baseUrl}app-leads/jop-lead`, formData);
  }

  // API call to update a job lead
  updateJopLead(leadId: number, formData: FormData): Observable<any> {
    return this._http.post(
      `${this.baseUrl}app-leads/jop-update/${leadId}`,
      formData
    );
  }

  createJopClaim(formData: FormData): Observable<any> {
    return this._http.post(
      `${this.baseUrl}app-claims/claim-jop-store`,
      formData
    );
  }
}
