import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { Category } from '../../Interfaces/d-products/IGetAllProducts';
import { User, ClaimComment } from './medical-claim.service';
// Reusing User and ClaimComment interfaces

// Define MotorInsurance interface
export interface MotorInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  claim_id: number;
  claim_number: string;
  claim_status: string;
}
export interface MotorClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  motor_insurance_id: number;
  motor_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  car_type_id: number;
  car_type: string;
  car_brand_id: number;
  car_brand: string;
  car_model_id: number;
  car_model: string;
  car_year_id: number;
  car_year: string;
  car_price: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  user?: User;
  motor_insurance?: MotorInsurance;
  comments?: ClaimComment[];
}

export type MotorClaimsListResponse = ApiResponse<MotorClaim[]>;
export type MotorClaimResponse = ApiResponse<MotorClaim>;

export interface MotorClaimFormData {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date?: string;
  motor_insurance_id: number;
  motor_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  car_type_id: number;
  car_type: string;
  car_brand_id: number;
  car_brand: string;
  car_model_id: number;
  car_model: string;
  car_year_id: number;
  car_year: string;
  car_price: string;
  description: string;
  status: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class MotorClaimsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'car-claims'; // Endpoint is 'car-claims' as per your data

  constructor(private http: HttpClient) {}

  /**
   * Fetches all motor claims.
   * @returns An Observable of type MotorClaimsListResponse.
   */
  getAll(): Observable<MotorClaimsListResponse> {
    return this.http.get<MotorClaimsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  /**
   * Fetches a single motor claim by its ID.
   * @param id The ID of the motor claim.
   * @returns An Observable of type MotorClaimResponse.
   */
  getById(id: number): Observable<MotorClaimResponse> {
    return this.http.get<MotorClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  /**
   * Creates a new motor claim.
   * @param data The form data for the new motor claim.
   * @returns An Observable of type MotorClaimResponse.
   */
  create(data: MotorClaimFormData): Observable<MotorClaimResponse> {
    return this.http.post<MotorClaimResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  /**
   * Updates an existing motor claim.
   * @param id The ID of the motor claim to update.
   * @param data The partial form data for updating the motor claim.
   * @returns An Observable of type MotorClaimResponse.
   */
  update(id: number, data: FormData): Observable<MotorClaimResponse> {
    return this.http.post<MotorClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  /**
   * Disables (soft deletes) a motor claim.
   * @param id The ID of the motor claim to disable.
   * @returns An Observable of type MotorClaimResponse.
   */
  disable(id: number): Observable<MotorClaimResponse> {
    return this.http.post<MotorClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  /**
   * Enables (recovers) a motor claim.
   * @param id The ID of the motor claim to enable.
   * @returns An Observable of type MotorClaimResponse.
   */
  enable(id: number): Observable<MotorClaimResponse> {
    return this.http.post<MotorClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  /**
   * Gets all comments for a specific motor claim
   * @param claimId The ID of the motor claim
   * @returns An Observable of type ApiResponse<ClaimComment[]>
   */
  getClaimComments(claimId: number): Observable<ApiResponse<ClaimComment[]>> {
    return this.http.get<ApiResponse<ClaimComment[]>>(`${this.baseUrl}motor-claims-comments/${claimId}`);
  }

  /**
   * Stores a new comment for a motor claim
   * @param claimId The ID of the motor claim
   * @param commentData The comment data to be stored
   * @returns An Observable of type ApiResponse<ClaimComment>
   */
  createComment(claimId: number, commentData: CreateCommentRequest, file: File | null): Observable<ApiResponse<ClaimComment>> {
    const formData = new FormData();
    
    // Append all comment data
    formData.append('user_id', commentData.user_id.toString());
    formData.append('user_role', commentData.user_role);
    formData.append('user_name', commentData.user_name);
    formData.append('comment', commentData.comment);
    formData.append('reciver_id', commentData.reciver_id.toString());
    formData.append('reciver_role', commentData.reciver_role);
    formData.append('reciver_name', commentData.reciver_name);
    formData.append('claim_id', commentData.claim_id.toString());
    formData.append('claim_number', commentData.claim_number);
    formData.append('claim_status', commentData.claim_status);

    // Append file if exists
    if (file) {
      formData.append('comment_file', file, file.name);
    }

    return this.http.post<ApiResponse<ClaimComment>>(`${this.baseUrl}motor-claims-comments/${claimId}/store`, formData);
  }
}

export { ClaimComment };
