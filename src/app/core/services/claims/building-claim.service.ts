import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { Category } from '../../Interfaces/d-products/IGetAllProducts';
import { User, ClaimComment } from './medical-claim.service';
// Reusing User and ClaimComment interfaces

// Define BuildingInsurance interface
export interface BuildingInsurance extends BaseEntity {
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

export interface BuildingClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  building_insurance_id: number;
  building_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  building_type_id: number;
  building_type: string;
  building_country_id: number;
  building_country: string;
  building_city: string;
  building_price: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  user?: User;
  building_insurance?: BuildingInsurance;
  comments?: ClaimComment[];
}

export type BuildingClaimsListResponse = ApiResponse<BuildingClaim[]>;
export type BuildingClaimResponse = ApiResponse<BuildingClaim>;

export interface BuildingClaimFormData {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date?: string;
  building_insurance_id: number;
  building_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  building_type_id: number;
  building_type: string;
  building_country_id: number;
  building_country: string;
  building_city: string;
  building_price: string;
  description: string;
  status: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingClaimsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'building-claims';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all building claims.
   * @returns An Observable of type BuildingClaimsListResponse.
   */
  getAll(): Observable<BuildingClaimsListResponse> {
    return this.http.get<BuildingClaimsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  /**
   * Fetches a single building claim by its ID.
   * @param id The ID of the building claim.
   * @returns An Observable of type BuildingClaimResponse.
   */
  getById(id: number): Observable<BuildingClaimResponse> {
    return this.http.get<BuildingClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  /**
   * Creates a new building claim.
   * @param data The form data for the new building claim.
   * @returns An Observable of type BuildingClaimResponse.
   */
  create(data: BuildingClaimFormData): Observable<BuildingClaimResponse> {
    return this.http.post<BuildingClaimResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  /**
   * Updates an existing building claim.
   * @param id The ID of the building claim to update.
   * @param data The partial form data for updating the building claim.
   * @returns An Observable of type BuildingClaimResponse.
   */
  update(id: number, data: FormData): Observable<BuildingClaimResponse> {
    return this.http.post<BuildingClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  /**
   * Disables (soft deletes) a building claim.
   * @param id The ID of the building claim to disable.
   * @returns An Observable of type BuildingClaimResponse.
   */
  disable(id: number): Observable<BuildingClaimResponse> {
    return this.http.post<BuildingClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  /**
   * Enables (recovers) a building claim.
   * @param id The ID of the building claim to enable.
   * @returns An Observable of type BuildingClaimResponse.
   */
  enable(id: number): Observable<BuildingClaimResponse> {
    return this.http.post<BuildingClaimResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  /**
   * Gets all comments for a specific building claim
   * @param claimId The ID of the building claim
   * @returns An Observable of type ApiResponse<ClaimComment[]>
   */
  getClaimComments(claimId: number): Observable<ApiResponse<ClaimComment[]>> {
    return this.http.get<ApiResponse<ClaimComment[]>>(`${this.baseUrl}building-claims-comments/${claimId}`);
  }

  /**
   * Stores a new comment for a building claim
   * @param claimId The ID of the building claim
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
  
      return this.http.post<ApiResponse<ClaimComment>>(`${this.baseUrl}building-claims-comments/${claimId}/store`, formData);
    }
}