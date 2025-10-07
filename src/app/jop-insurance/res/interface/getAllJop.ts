export interface GetAllJop {
  success: boolean;
  message: string;
  data: IJopInsurance[];
}

export interface IJopInsurance {
  id: number;
  category_id: number;
  en_title: any;
  ar_title: any;
  year_money: any;
  month_money: any;
  company_name: any;
  active_status: any;
  created_at: string;
  updated_at: string;
  category: Category;
  jopchoices: any[];
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
