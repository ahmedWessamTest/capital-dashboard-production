import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WEB_SITE_BASE_URL } from "../../../../../core/constants/WEB_SITE_BASE_UTL";

export interface ContactUs {
  id: number;
  en_address: string | null;
  ar_address: string | null;
  google_plus: string | null;
  first_phone: string | null;
  second_phone: string | null;
  third_phone: string | null;
  fourth_phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  en_meta_title: string | null;
  ar_meta_title: string | null;
  en_meta_description: string | null;
  ar_meta_description: string | null;
  en_contact_title: string | null;
  ar_contact_title: string | null;
  en_contact_text: string | null;
  ar_contact_text: string | null;
  active_status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactUsResponse {
  success: boolean;
  message: string;
  data: ContactUs;
}

export interface ContactUsUpdate {
  en_address: string;
  ar_address: string;
  google_plus?: string;
  first_phone?: string;
  second_phone?: string;
  third_phone?: string;
  fourth_phone?: string;
  whatsapp?: string;
  email: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  en_contact_title: string;
  ar_contact_title: string;
  en_contact_text: string;
  ar_contact_text: string;
}

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  constructor(private http: HttpClient) {}

  getContactUs(): Observable<ContactUsResponse> {
    return this.http.get<ContactUsResponse>(`${WEB_SITE_BASE_URL}contact-us`);
  }

  updateContactUs(contactUs: ContactUsUpdate): Observable<{ success: string ,message: string,data: ContactUs}> {
    const formData = new FormData();
    Object.keys(contactUs).forEach(key => {
      if (contactUs[key as keyof ContactUsUpdate] !== undefined) {
        formData.append(key, contactUs[key as keyof ContactUsUpdate]!.toString());
      }
    });
    return this.http.post<{ success: string ,message: string,data: ContactUs}>(
      `${WEB_SITE_BASE_URL}contact-us/1`,
      formData
    );
  }
}