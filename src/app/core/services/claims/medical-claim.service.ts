import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { Category } from '../../Interfaces/d-products/IGetAllProducts';

// Define interfaces for related entities if they are not already defined globally
// Assuming User and MedicalInsurance are similar to Category in structure
export interface User extends BaseEntity {
  apple_id: string | null;
  google_id: string | null;
  name: string;
  phone: string | null;
  gender: string;
  birth_date: string | null;
  email: string;
  email_verified_at: string | null;
  role: string;
  admin_status: number;
  active_code: string | null;
  forget_code: string | null;
  deactive_status: number;
  delete_status: number;
  device_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimComment extends BaseEntity {
  user_id: number;
  user_role: string | null;
  user_name: string | null;
  comment: string;
  comment_file: string | null;
  comment_date: string | null;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  claim_id: number;
  claim_number: string | null;
  claim_status: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  medical_insurance_id: number | null;
  medical_insurance_number: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  user?: User;
  medical_insurance?: MedicalInsurance;
  comments?: ClaimComment[];
}

export type MedicalClaimsListResponse = ApiResponse<MedicalClaim[]>;
export type MedicalClaimResponse = ApiResponse<MedicalClaim>;

export interface MedicalClaimFormData {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date?: string;
  medical_insurance_id?: number;
  medical_insurance_number?: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  description: string;
  status: string | number; // Assuming status can be sent as string or number
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

@Injectable({
  providedIn: 'root'
})
export class MedicalClaimsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'medical-claims';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all medical claims.
   * @returns An Observable of type MedicalClaimsListResponse.
   */
  getAll(): Observable<MedicalClaimsListResponse> {
    return this.http.get<MedicalClaimsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  /**
   * Fetches a single medical claim by its ID.
   * @param id The ID of the medical claim.
   * @returns An Observable of type MedicalClaimResponse.
   */
  getById(id: number): Observable<MedicalClaimResponse> {
    return this.http.get<MedicalClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  /**
   * Creates a new medical claim.
   * @param data The form data for the new medical claim.
   * @returns An Observable of type MedicalClaimResponse.
   */
  create(data: MedicalClaimFormData): Observable<MedicalClaimResponse> {
    return this.http.post<MedicalClaimResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  /**
   * Updates an existing medical claim.
   * @param id The ID of the medical claim to update.
   * @param data The partial form data for updating the medical claim.
   * @returns An Observable of type MedicalClaimResponse.
   */
  update(id: number, data: FormData): Observable<MedicalClaimResponse> {
    return this.http.post<MedicalClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  /**
   * Disables (soft deletes) a medical claim.
   * @param id The ID of the medical claim to disable.
   * @returns An Observable of type MedicalClaimResponse.
   */
  disable(id: number): Observable<MedicalClaimResponse> {
    return this.http.post<MedicalClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  /**
   * Enables (recovers) a medical claim.
   * @param id The ID of the medical claim to enable.
   * @returns An Observable of type MedicalClaimResponse.
   */
  enable(id: number): Observable<MedicalClaimResponse> {
    return this.http.post<MedicalClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  /**
   * Gets all comments for a specific medical claim
   * @param claimId The ID of the medical claim
   * @returns An Observable of type ApiResponse<ClaimComment[]>
   */
  getClaimComments(claimId: number): Observable<ApiResponse<ClaimComment[]>> {
    return this.http.get<ApiResponse<ClaimComment[]>>(`${this.baseUrl}medical-claims-comments/${claimId}`);
  }

  /**
   * Stores a new comment for a medical claim
   * @param claimId The ID of the medical claim
   * @param commentData The comment data to be stored
   * @param file Optional file to be attached to the comment
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

    return this.http.post<ApiResponse<ClaimComment>>(`${this.baseUrl}medical-claims-comments/${claimId}/store`, formData);
  }
}