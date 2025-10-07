import { BaseEntity } from '../../../../shared/service/genereic-table.service';

// API response interface (what comes from the server)
export interface IAllJopPolicyApiResponse {
  success: boolean;
  message: string;
  data: IJopPolicyApiResponse[];
}

export interface IJopPolicyApiResponse {
  id: number;
  category_id: number;
  en_title: string;
  ar_title?: string;
  year_money: number;
  month_money: number;
  company_name: string;
  active_status: number; // API returns number
  created_at: string;
  updated_at: string;
  category: Category;
  jopchoices: Jopchoice[];
}

// Normalized interface (what we use in components)
export interface IAllJopPolicy {
  success: boolean;
  message: string;
  data: IJopPolicy[];
}

export interface IJopPolicy extends BaseEntity {
  category_id: number;
  en_title: string;
  ar_title?: string;
  year_money: number;
  month_money: number;
  company_name: string;
  active_status: boolean; // Normalized to boolean
  created_at: string;
  updated_at: string;
  category: Category;
  jopchoices: Jopchoice[];
}

export interface Category {
  id: number;
  en_title: string;
  ar_title: string;
  en_slug: string;
  ar_slug: string;
  en_small_description: string;
  ar_small_description: string;
  en_main_description: string;
  ar_main_description: string;
  network_link: string;
  counter_number: number;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  ar_first_script: string;
  en_first_script: string;
  active_status: string;
  created_at: string;
  updated_at: string;
}

export interface Jopchoice {
  id: number;
  category_id: number;
  jop_insurance_id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

export interface IJopPolicyResponseForId {
  success: boolean;
  message: string;
  data: IJopPolicy;
}
