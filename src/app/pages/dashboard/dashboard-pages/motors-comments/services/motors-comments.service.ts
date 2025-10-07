import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface MotorRequestComment {
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
  request?: any;
}

export interface CreateMotorCommentRequest {
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  request_id: string | number;
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
export class MotorRequestCommentsService {
  private readonly baseUrl = `${WEB_SITE_BASE_URL}motor-request-comments`;

  constructor(private http: HttpClient) {}

  getAll(requestId: number): Observable<ApiResponse<MotorRequestComment[]>> {
    return this.http.get<ApiResponse<MotorRequestComment[]>>(`${this.baseUrl}/${requestId}`);
  }

  create(requestId: number, commentData: CreateMotorCommentRequest, file?: File): Observable<ApiResponse<MotorRequestComment>> {
    const formData = new FormData();
    
    formData.append('user_id', commentData.user_id.toString());
    formData.append('user_role', commentData.user_role);
    formData.append('user_name', commentData.user_name);
    formData.append('comment', commentData.comment);
    formData.append('reciver_id', commentData.reciver_id.toString());
    formData.append('reciver_role', commentData.reciver_role);
    formData.append('reciver_name', commentData.reciver_name);
    formData.append('request_id', requestId.toString());
    formData.append('request_status', commentData.request_status);

    if (file) {
      formData.append('comment_file', file, file.name);
    }
console.log(formData)
    return this.http.post<ApiResponse<MotorRequestComment>>(`${this.baseUrl}/${requestId}/store`, formData);
  }

  update(requestId: number, commentId: number, commentData: Partial<CreateMotorCommentRequest>): Observable<ApiResponse<MotorRequestComment>> {
    return this.http.put<ApiResponse<MotorRequestComment>>(`${this.baseUrl}/${requestId}/${commentId}`, commentData);
  }

  delete(requestId: number, commentId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${requestId}/${commentId}`);
  }
}