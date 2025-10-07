import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';

export interface AboutDownload {
  id: number;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  android_download_link: string;
  ios_download_link: string;
  elwinsh_link: string;
  active_status: string;
  created_at: string | null;
  updated_at: string;
  main_download_link?: string;
}

export interface AboutDownloadResponse {
  success: boolean;
  message: string;
  data: AboutDownload;
}

export interface AboutDownloadUpdate {
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  android_download_link: string;
  ios_download_link: string;
  elwinsh_link: string;
  main_download_link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutDownloadService {
  private http = inject(HttpClient);

  getAboutDownload(): Observable<AboutDownloadResponse> {
    return this.http.get<AboutDownloadResponse>(`https://digitalbondmena.com/insurance/api/about-download`);
  }

  updateAboutDownload(data: AboutDownloadUpdate): Observable<{ success: string, message: string, data: AboutDownload }> {
    return this.http.post<{ success: string, message: string, data: AboutDownload }>(`https://digitalbondmena.com/insurance/api/about-download/1`, data);
  }
}