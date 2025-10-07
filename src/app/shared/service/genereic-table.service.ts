import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface BaseEntity {
  id: number;
  active_status:boolean;
  [key: string]: any; // Allow additional properties
}


// In your Column interface (genereic-table.service.ts), add an optional displayFn:
export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'image' | 'date' | 'link' | 'boolean';
  maxLength?: number;
  displayFn?: (item: any) => string; 
  choicesProperty?: string; 
}
@Injectable({
  providedIn: 'root'
})
export class GenericDataService {
  private baseUrl = WEB_SITE_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll<T>(endpoint: string): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}${endpoint}`);
  }

  enable<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
    
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}/recover`, {});
  }

  disable<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}/delete`, {});
  }
  create<T>(endpoint: string, data: T): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }
  update<T>(endpoint: string, id: number, data: T): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}/${id}`, data);
  }
}