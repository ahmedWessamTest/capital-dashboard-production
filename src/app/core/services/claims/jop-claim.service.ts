import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  BaseEntity,
} from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { Category } from '../../Interfaces/d-products/IGetAllProducts';
import { ClaimComment, User } from './medical-claim.service';
// Reusing User and ClaimComment interfaces

// Define JobInsurance interface based on existing IJopInsurance
export interface JobInsurance extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title: string;
  year_money: string;
  month_money: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  jopchoices?: any[];
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

export interface JobClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  jop_insurance_id: number;
  jop_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  job_title: string;
  company_name: string;
  years_of_experience: number;
  profession_id: number;
  profession_name: string;
  salary: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  user?: User;
  jop_insurance?: JobInsurance;
  comments?: ClaimComment[];
}

export type JobClaimsListResponse = ApiResponse<JobClaim[]>;
export type JobClaimResponse = ApiResponse<JobClaim>;

export interface JobClaimFormData {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date?: string;
  jop_insurance_id: number;
  jop_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  job_title: string;
  company_name: string;
  years_of_experience: number;
  profession_id: number;
  profession_name: string;
  salary: string;
  description: string;
  status: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class JobClaimsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'jop-claims'; // Endpoint is 'jop-claims' as requested

  constructor(private http: HttpClient) {}

  /**
   * Fetches all job claims.
   * @returns An Observable of type JobClaimsListResponse.
   */
  getAll(): Observable<JobClaimsListResponse> {
    return this.http.get<JobClaimsListResponse>(
      `${this.baseUrl}${this.endpoint}`
    );
  }

  /**
   * Fetches a single job claim by its ID.
   * @param id The ID of the job claim.
   * @returns An Observable of type JobClaimResponse.
   */
  getById(id: number): Observable<JobClaimResponse> {
    return this.http.get<JobClaimResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  /**
   * Creates a new job claim.
   * @param data The form data for the new job claim.
   * @returns An Observable of type JobClaimResponse.
   */
  create(data: JobClaimFormData): Observable<JobClaimResponse> {
    return this.http.post<JobClaimResponse>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  /**
   * Updates an existing job claim.
   * @param id The ID of the job claim to update.
   * @param data The partial form data for updating the job claim.
   * @returns An Observable of type JobClaimResponse.
   */
  update(id: number, data: FormData): Observable<JobClaimResponse> {
    return this.http.post<JobClaimResponse>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * Disables (soft deletes) a job claim.
   * @param id The ID of the job claim to disable.
   * @returns An Observable of type JobClaimResponse.
   */
  disable(id: number): Observable<JobClaimResponse> {
    return this.http.post<JobClaimResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/delete`,
      {}
    );
  }

  /**
   * Enables (recovers) a job claim.
   * @param id The ID of the job claim to enable.
   * @returns An Observable of type JobClaimResponse.
   */
  enable(id: number): Observable<JobClaimResponse> {
    return this.http.post<JobClaimResponse>(
      `${this.baseUrl}${this.endpoint}/${id}/recover`,
      {}
    );
  }

  /**
   * Gets all comments for a specific job claim
   * @param claimId The ID of the job claim
   * @returns An Observable of type ApiResponse<ClaimComment[]>
   */
  getClaimComments(claimId: number): Observable<ApiResponse<ClaimComment[]>> {
    return this.http.get<ApiResponse<ClaimComment[]>>(
      `${this.baseUrl}jop-claims-comments/${claimId}`
    );
  }

  /**
   * Stores a new comment for a job claim
   * @param claimId The ID of the job claim
   * @param commentData The comment data to be stored
   * @returns An Observable of type ApiResponse<ClaimComment>
   */
  createComment(
    claimId: number,
    commentData: CreateCommentRequest,
    file: File | null
  ): Observable<ApiResponse<ClaimComment>> {
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

    return this.http.post<ApiResponse<ClaimComment>>(
      `${this.baseUrl}jop-claims-comments/${claimId}/store`,
      formData
    );
  }
}

export { ClaimComment };
