import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity, ApiResponse } from '../../../shared/service/genereic-table.service';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';


// Interfaces for nested data (Claims and Policies)
export interface MedicalClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  medical_insurance_id: number | null;
  medical_insurance_number: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string | null;
  description: string;
  status: string;
}

export interface MotorClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  motor_insurance_id: number | null;
  motor_insurance_number: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string | null;
  car_type_id: number | null;
  car_type: string | null;
  car_brand_id: number | null;
  car_brand: string | null;
  car_model_id: number | null;
  car_model: string | null;
  car_year_id: number | null;
  car_year: string | null;
  car_price: string | null; // Assuming decimal/float as string from backend
  description: string;
  status: string;
}

export interface BuildingClaim extends BaseEntity {
  user_id: number;
  category_id: number;
  claim_number: string;
  claim_date: string | null;
  building_insurance_id: number | null;
  building_insurance_number: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string | null;
  building_type_id: number | null;
  building_type: string | null;
  building_country_id: number | null;
  building_country: string | null;
  building_city: string | null;
  building_price: string | null; // Assuming decimal/float as string from backend
  description: string;
  status: string;
}

export interface MedicalPolicy extends BaseEntity {
  user_id: number;
  category_id: number;
  medical_insurance_id: number;
  payment_method: string;
  medical_insurance_number: string;
  admin_medical_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  start_date: string;
  duration: string;
  end_date: string;
}

export interface MotorPolicy extends BaseEntity {
  user_id: number;
  category_id: number;
  motor_insurance_id: number;
  payment_method: string;
  motor_insurance_number: string;
  admin_motor_insurance_number: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  car_type_id: number;
  car_type: string;
  car_brand_id: number;
  car_brand: string;
  car_model_id: number;
  car_model: string;
  car_year_id: number;
  car_year: string;
  car_price: string; // Assuming decimal/float as string from backend
  start_date: string;
  duration: string;
  end_date: string;
}

export interface BuildingPolicy extends BaseEntity {
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
  building_price: string; // Assuming decimal/float as string from backend
  start_date: string;
  duration: string;
  end_date: string;
}

// Main User Interface
export interface User extends BaseEntity {
  apple_id: string | null;
  google_id: string | null;
  name: string;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  email: string | null;
  email_verified_at: string | null;
  role: string;
  admin_status: number;
  active_code: string | null;
  forget_code: string | null;
  deactive_status: number;
  delete_status: number;
  device_token: string | null;
  created_at: string;
  updated_at: string;
  // Optional relations for single user fetch
  medicalclaims?: MedicalClaim[];
  motorclaims?: MotorClaim[];
  buildingclaims?: BuildingClaim[];
  medicalpolicy?: MedicalPolicy[];
  motorpolicy?: MotorPolicy[];
  buildingpolicy?: BuildingPolicy[];
}

// API Response Types
export type UsersResponse = ApiResponse<User[]>;
export type UserResponse = ApiResponse<User>;

// Custom response for activate/delete, where 'success' is a string
export interface UserActionResponse {
  data: User;
  success: string;
}

// Form Data for creating/updating a user
export interface UserStoreData {
  name: string;
  phone: string;
  email: string;
  // Add other fields if they can be set on creation/update
  password?: string;
  gender?: string;
  birth_date?: string;
  role?: string;
  admin_status?: number;
  active_status?: number;
  deactive_status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = WEB_SITE_BASE_URL;
  private endpoint = 'users';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all users.
   * @returns An Observable of type UsersResponse.
   */
  getAll(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.baseUrl}${this.endpoint}`);
  }
  getAllEmployees(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.baseUrl}${this.endpoint}/employee`);
  }

  /**
   * Fetches a single user by ID, including their associated claims and policies.
   * @param id The ID of the user.
   * @returns An Observable of type UserResponse.
   */
  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  /**
   * Creates a new user.
   * @param data The user data to be sent.
   * @returns An Observable of type UserResponse.
   */
  create(data: UserStoreData): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}${this.endpoint}`, data);
  }

  /**
   * Updates an existing user.
   * Note: The provided JSON did not include an update endpoint response directly for users.
   * Assuming a standard PUT/PATCH request returning a single user.
   * @param id The ID of the user to update.
   * @param data The partial user data to update.
   * @returns An Observable of type UserResponse.
   */
  update(id: number, data: Partial<UserStoreData>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}${this.endpoint}/${id}`, data);
  }

  /**
   * Activates a user.
   * The API response for this action has a slightly different structure for the success message.
   * @param id The ID of the user to activate.
   * @returns An Observable of type UserActionResponse.
   */
  activate(id: number): Observable<UserActionResponse> {
    return this.http.post<UserActionResponse>(`${this.baseUrl}users/${id}/enable`, {}); // Assuming empty body for activation
  }

  /**
   * Deletes (marks as deleted) a user.
   * The API response for this action has a slightly different structure for the success message.
   * @param id The ID of the user to delete.
   * @returns An Observable of type UserActionResponse.
   */
  delete(id: number): Observable<UserActionResponse> {
    return this.http.post<UserActionResponse>(`${this.baseUrl}users/${id}/delete`, {}); // Assuming empty body for deletion
  }
}