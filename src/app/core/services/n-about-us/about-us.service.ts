import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
export interface IAboutUsData {
  success: boolean;
  message: string;
  data: {
    id: number;
    en_main_title: string;
    ar_main_title: string;
    en_main_content: string;
    ar_main_content: string;
    main_image: string | null;
    en_mission: string;
    ar_mission: string;
    en_vision: string;
    ar_vision: string;
    en_history_title: string;
    ar_history_title: string;
    en_history_text: string;
    ar_history_text: string;
    history_image: string | null;
    en_meta_title: string;
    ar_meta_title: string;
    en_meta_description: string;
    ar_meta_description: string;
    en_about_first_feature_title: string | null;
    ar_about_first_feature_title: string | null;
    en_about_second_feature_title: string | null;
    ar_about_second_feature_title: string | null;
    en_about_first_feature_text: string | null;
    ar_about_first_feature_text: string | null;
    en_about_second_feature_text: string | null;
    ar_about_second_feature_text: string | null;
    years_of_experience: string | null;
    active_status: string;
    created_at: string | null;
    updated_at: string;
  };
}

export interface IAboutUsUpdateResponse {
  success: boolean;
  message: string;
  data: IAboutUsData['data'];
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private apiUrl = `${WEB_SITE_BASE_URL}about-us`;

  constructor(private http: HttpClient) {}

  getAboutUs(): Observable<IAboutUsData> {
    return this.http.get<IAboutUsData>(this.apiUrl);
  }

  updateAboutUs(formData: FormData): Observable<IAboutUsUpdateResponse> {
    return this.http.post<IAboutUsUpdateResponse>(`${this.apiUrl}/1`, formData);
  }
}