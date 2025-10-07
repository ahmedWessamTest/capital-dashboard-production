import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Project Interface
export interface Project {
  id: number;
  en_alt_main_image: string;
  ar_alt_main_image: string;
  main_image: string;
  en_alt_banner_image: string;
  ar_alt_banner_image: string;
  banner_image: string;
  main_file_link: string;
  google_map_link: string;
  en_form_first_input_info: string;
  ar_form_first_input_info: string;
  en_form_second_input_info: string;
  ar_form_second_input_info: string;
  en_title_form: string;
  ar_title_form: string;
  en_description_form: string;
  ar_description_form: string;
  en_project_name: string;
  ar_project_name: string;
  en_small_text: string;
  ar_small_text: string;
  en_project_title: string;
  ar_project_title: string;
  en_project_description: string;
  ar_project_description: string;
  en_script_text: string;
  ar_script_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  project_date: string;
  en_slug: string;
  ar_slug: string;
  active_status: string | boolean;
  created_at: string;
  updated_at: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ProjectsListResponse = ApiResponse<Project[]>;
export type ProjectResponse = ApiResponse<Project>;

// DTO
export interface ProjectFormData {
  en_project_name: string;
  ar_project_name: string;
  en_project_title: string;
  ar_project_title: string;
  en_small_text: string;
  ar_small_text: string;
  en_project_description: string;
  ar_project_description: string;
  en_script_text: string;
  ar_script_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  active_status: string | number;
  en_title_form: string;
  ar_title_form: string;
  en_description_form: string;
  ar_description_form: string;
  en_form_first_input_info: string;
  ar_form_first_input_info: string;
  en_form_second_input_info: string;
  ar_form_second_input_info: string;
  main_file_link: string;
  google_map_link: string;
  en_alt_main_image: string;
  ar_alt_main_image: string;
  en_alt_banner_image: string;
  ar_alt_banner_image: string;
  main_image?: File;
  banner_image?: File;
  en_slug: string;
  ar_slug: string;
  project_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl = 'https://digitalbondmena.com/darnaapi/api/';
  private endpoint = 'projects';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProjectsListResponse> {
    return this.http.get<ProjectsListResponse>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(data: ProjectFormData): Observable<ProjectResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<ProjectResponse>(`${this.baseUrl}${this.endpoint}`, formData);
  }

  update(id: number, data: Partial<ProjectFormData>): Observable<ProjectResponse> {
    const formData = this.buildFormData(data);
    return this.http.post<ProjectResponse>(`${this.baseUrl}${this.endpoint}/${id}`, formData);
  }

  disable(id: number): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.baseUrl}${this.endpoint}/${id}/delete`, {});
  }

  enable(id: number): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.baseUrl}${this.endpoint}/${id}/recover`, {});
  }

  private buildFormData(data: Partial<ProjectFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if ((key === 'main_image' || key === 'banner_image') && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value?.toString() ?? '');
        }
      }
    });

    return formData;
  }
}