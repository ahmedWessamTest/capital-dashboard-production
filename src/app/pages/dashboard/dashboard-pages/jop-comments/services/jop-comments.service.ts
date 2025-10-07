import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface JobRequestComment {
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
}

export interface CreateJobCommentRequest {
  user_id: number;
  user_role: string;
  user_name: string;
  comment: string;
  reciver_id: number;
  reciver_role: string;
  reciver_name: string;
  request_id: number;
  request_status: string;
}

export interface JobCommentsResponse {
  success: boolean;
  message: string;
  data: JobRequestComment[];
}

export interface JobCommentResponse {
  success: boolean;
  message: string;
  data: JobRequestComment;
}

@Injectable({
  providedIn: 'root',
})
export class JobRequestCommentsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'jop-request-comments';

  constructor(private http: HttpClient) {}

  /**
   * Get all comments for a specific job request
   * @param requestId The ID of the job request
   * @returns Observable<JobCommentsResponse>
   */
  getAll(requestId: number): Observable<JobCommentsResponse> {
    return this.http.get<JobCommentsResponse>(
      `${this.baseUrl}${this.endpoint}/${requestId}`
    );
  }

  /**
   * Create a new comment for a job request
   * @param requestId The ID of the job request
   * @param commentData The comment data
   * @param file Optional file attachment
   * @returns Observable<JobCommentResponse>
   */
  create(
    requestId: number,
    commentData: CreateJobCommentRequest,
    file?: File
  ): Observable<JobCommentResponse> {
    const formData = new FormData();

    // Append comment data
    formData.append('user_id', commentData.user_id.toString());
    formData.append('user_role', commentData.user_role);
    formData.append('user_name', commentData.user_name);
    formData.append('comment', commentData.comment);
    formData.append('reciver_id', commentData.reciver_id.toString());
    formData.append('reciver_role', commentData.reciver_role);
    formData.append('reciver_name', commentData.reciver_name);
    formData.append('request_id', commentData.request_id.toString());
    formData.append('request_status', commentData.request_status);

    // Append file if provided
    if (file) {
      formData.append('comment_file', file, file.name);
    }

    return this.http.post<JobCommentResponse>(
      `${this.baseUrl}${this.endpoint}/${requestId}/store`,
      formData
    );
  }

  /**
   * Update a comment
   * @param requestId The ID of the job request
   * @param commentId The ID of the comment
   * @param commentData The updated comment data
   * @returns Observable<JobCommentResponse>
   */
  update(
    requestId: number,
    commentId: number,
    commentData: Partial<CreateJobCommentRequest>
  ): Observable<JobCommentResponse> {
    return this.http.put<JobCommentResponse>(
      `${this.baseUrl}${this.endpoint}/${requestId}/${commentId}`,
      commentData
    );
  }

  /**
   * Delete a comment
   * @param requestId The ID of the job request
   * @param commentId The ID of the comment
   * @returns Observable<JobCommentResponse>
   */
  delete(requestId: number, commentId: number): Observable<JobCommentResponse> {
    return this.http.delete<JobCommentResponse>(
      `${this.baseUrl}${this.endpoint}/${requestId}/${commentId}`
    );
  }
}
