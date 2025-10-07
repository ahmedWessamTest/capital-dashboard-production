import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface BuildingRequestComment {
  id: number;
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  comment_file: string | null;
  comment_date: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  request_id: number;
  request_status: string;
  created_at: string;
  updated_at: string;
  user?: any;
  reciver?: any;
  request?: {
    id: number;
    user_id: number;
    category_id: number;
    building_insurance_id: number;
    payment_method: string;
    building_insurance_number: string;
    admin_building_insurance_number: string;
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
    start_date: string;
    duration: string;
    end_date: string;
    active_status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateBuildingCommentRequest {
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  request_id: number | string;
  request_status: string;
  comment_file?: File | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingRequestCommentsService {
  private readonly baseUrl = `${WEB_SITE_BASE_URL}building-request-comments`;

  constructor(private http: HttpClient) {}

  getAll(requestId: number): Observable<ApiResponse<BuildingRequestComment[]>> {
    return this.http.get<ApiResponse<BuildingRequestComment[]>>(`${this.baseUrl}/${requestId}`);
  }

  create(requestId: number, commentData: CreateBuildingCommentRequest, file?: File): Observable<ApiResponse<BuildingRequestComment>> {
    const formData = new FormData();
    
    // Append all comment data
    formData.append('user_id', commentData.user_id.toString());
    formData.append('user_role', commentData.user_role);
    formData.append('user_name', commentData.user_name);
    formData.append('comment', commentData.comment);
    formData.append('reciver_id', commentData.reciver_id.toString());
    formData.append('reciver_role', commentData.reciver_role);
    formData.append('reciver_name', commentData.reciver_name);
    formData.append('request_id', commentData.request_id.toString());
    formData.append('request_status', commentData.request_status);

    // Append file if exists
    if (file) {
      formData.append('comment_file', file, file.name);
    }

    return this.http.post<ApiResponse<BuildingRequestComment>>(`${this.baseUrl}/${requestId}/store`, formData);
  }

  update(requestId: number, commentId: number, commentData: Partial<CreateBuildingCommentRequest>): Observable<ApiResponse<BuildingRequestComment>> {
    return this.http.put<ApiResponse<BuildingRequestComment>>(`${this.baseUrl}/${requestId}/${commentId}`, commentData);
  }

  delete(requestId: number, commentId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${requestId}/${commentId}`);
  }
}