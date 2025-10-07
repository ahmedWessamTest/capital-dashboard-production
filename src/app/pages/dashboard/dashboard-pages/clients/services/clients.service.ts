import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { BaseEntity } from '../../../../../shared/service/genereic-table.service';

// Client Interface
export interface Client extends BaseEntity {
  en_client_name: string;
  ar_client_name: string;
  client_image: string;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ClientsListResponse = ApiResponse<Client[]>;
export type ClientResponse = ApiResponse<Client>;

// DTOs
export interface ClientFormData {
  en_client_name: string;
  ar_client_name: string;
  client_image?: File;
  active_status: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'clients';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ClientsListResponse> {
    return this.http.get<ClientsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: ClientFormData): Observable<ClientResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<ClientResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<ClientFormData>): Observable<ClientResponse> {
    const formData = this.buildFormData(data);
    return this.http.put<ClientResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<ClientFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'client_image' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'client_image') {
          formData.append(key, value.toString());
        }
      }
    });

    return formData;
  }
}