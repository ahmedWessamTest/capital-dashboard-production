import { interval, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { toFormData } from '../../../../../shared/utils/form-data.util';
import { isPlatformBrowser } from '@angular/common';
interface ISendNotification {
  titleMessage: string;
  textMessage: string;
}
export interface IExpiryNotificationsResponse {
  Motorjobs: Motorjob[]
  Buildingjobs: Buildingjob[]
  Medicaljobs: Medicaljob[]
  Jopjobs: Jopjob[]
}

export interface Motorjob {
  id: number
  user_id: number
  category_id: number
  motor_insurance_id: number
  payment_method: string
  motor_insurance_number: string
  admin_motor_insurance_number: string
  name: string
  email: string
  phone: string
  birthdate: any
  gender: any
  car_type_id: any
  car_type: string
  car_brand_id: any
  car_brand: string
  car_model_id: any
  car_model: string
  car_year_id: any
  car_year: string
  car_price: string
  start_date: string
  duration: string
  end_date: string
  active_status: string
  expire_notification: number
  created_at: string
  updated_at: string
}

export interface Buildingjob {
  id: number
  user_id: number
  category_id: number
  policy_id: any
  building_insurance_id: number
  payment_method: string
  building_insurance_number: string
  admin_building_insurance_number: string
  name: string
  email: string
  phone: string
  birthdate: any
  gender: any
  building_type_id: any
  building_type: string
  building_country_id: any
  building_country: string
  building_city: string
  building_price: string
  company_id: any
  company_name: any
  company_building_number: any
  company_building_total_money: any
  company_address: any
  request_type: any
  start_date: string
  duration: string
  end_date: string
  total_year_money: any
  total_month_money: any
  active_status: string
  expire_notification: number
  created_at: string
  updated_at: string
}

export interface Medicaljob {
  id: number
  user_id: number
  category_id: number
  medical_insurance_id: number
  policy_id: any
  payment_method: string
  medical_insurance_number: string
  admin_medical_insurance_number: string
  name: string
  email: string
  phone: string
  birthdate: any
  gender: string
  company_id: any
  company_name: any
  company_employee_number: any
  company_employee_avg: any
  company_address: any
  request_type: any
  start_date: string
  duration: string
  end_date: string
  total_year_money: any
  total_month_money: any
  active_status: string
  expire_notification: number
  created_at: string
  updated_at: string
}

export interface Jopjob {
  id: number
  user_id: number
  category_id: number
  jop_insurance_id: number
  policy_id: any
  payment_method: string
  jop_insurance_number: string
  admin_medical_insurance_number: any
  name: string
  email: string
  phone: string
  jop_title: string
  jop_price: number
  jop_main_id: string
  jop_second_id: string
  company_id: any
  company_name: any
  company_employee_number: any
  company_employee_avg: any
  company_employee_total_money: any
  company_address: any
  request_type: any
  start_date: string
  duration: string
  end_date: string
  total_year_money: any
  total_month_money: any
  active_status: string
  expire_notification: number
  created_at: string
  updated_at: string
}
export interface IAdminCommentResponse {
  MotorComment: IComment[]
  BuildingComment: IComment[]
  MedicalComment: IComment[]
  JopComment: IComment[]
  MotorClaimComment: IComment[]
  BuildingClaimComment: IComment[]
  MedicalClaimComment: IComment[]
  JopClaimComment: IComment[]
}

export interface IComment {
  id: number
  user_id: number
  user_role: string
  user_name: string
  comment: string
  comment_file: any
  comment_date: string
  reciver_id: number
  reciver_role: string
  reciver_name: string
  request_id: number
  request_status: string
  created_at: string
  updated_at: string
  request: Request
}

export interface Request {
  id: number
  user_id: number
  category_id: number
  jop_insurance_id: number
  policy_id: any
  payment_method: string
  jop_insurance_number: string
  admin_medical_insurance_number: any
  name: string
  email: string
  phone: string
  jop_title: string
  jop_price: number
  jop_main_id: string
  jop_second_id: any
  company_id: any
  company_name: any
  company_employee_number: any
  company_employee_avg: any
  company_employee_total_money: any
  company_address: any
  request_type: any
  start_date: string
  duration: string
  end_date: string
  total_year_money: any
  total_month_money: any
  active_status: string
  expire_notification: number
  created_at: string
  updated_at: string
}

@Injectable({
  providedIn: 'root'
})
export class SendNotificationService {
  private http = inject(HttpClient);
  hasNewNotify = signal<boolean>(false);
  private _PLATFORM_ID = inject(PLATFORM_ID)
  adminNotifications = signal<any>([]);
  constructor(){
    this.startPolling()
  }
  
  sendNotification(notificationData: ISendNotification) {
    const formData = toFormData<ISendNotification>(notificationData);

    return this.http.post(`${WEB_SITE_BASE_URL}sendAllUsersNotification`, formData);
  }
  getExpireNotifications(): Observable<IExpiryNotificationsResponse> {
    return this.http.get<IExpiryNotificationsResponse>(`${WEB_SITE_BASE_URL}getExpirePolicy`);
  }
  getAdminNotifications():Observable<IAdminCommentResponse> {
    return this.http.get<IAdminCommentResponse>(`${WEB_SITE_BASE_URL}admincommecnts`)
  }
  private startPolling(){
    interval(5000).pipe(switchMap(()=> this.http.get<IAdminCommentResponse>(`${WEB_SITE_BASE_URL}admincommecnts`))).subscribe({
      next: (res) => {
        const merged = [
  ...(res.BuildingClaimComment ?? []),
  ...(res.JopClaimComment ?? []),
  ...(res.MotorClaimComment ?? []),
  ...(res.MedicalClaimComment ?? []),
  ...(res.BuildingComment ?? []),
  ...(res.JopComment ?? []),
  ...(res.MedicalComment ?? []),
  ...(res.MotorComment ?? []),
];
const flatted = merged.map((item:any)=>{
  if(item.request && typeof item.request === 'object') {
    return {...item, ...item.request,req_id:item.request.id,req_type:"policy",comment_date: this.parseDateTime(item.comment_date),category_name:this.getCategoryName(item?.request.category_id)}
  }
  if(item.claim && typeof item.claim === 'object') {
    return {...item,...item.claim,req_id:item.claim.id,req_type:"claim",comment_date: this.parseDateTime(item.comment_date),category_name:this.getCategoryName(item?.claim.category_id)}
  }
  return {...item,
    comment_date: this.parseDateTime(item.comment_date),
    category_name:this.getCategoryName(item?.category_id)
  };
});
this.handleNewNotifications(flatted);
}
    })
  }
  private parseDateTime(dateStr: string): Date {
  if (!dateStr) return null as any;
  return new Date(dateStr);
}
getCategoryName(name: number): string {
  switch (name) {
    case 1:
      return 'medical';
    case 2:
      return 'motor';
    case 3:
      return 'building';
    case 5:
      return 'job';
    default:
      return ''; // أو ممكن ترجع 'unknown'
  }
}
private handleNewNotifications(newList: IAdminCommentResponse[]) {
  if(!isPlatformBrowser(this._PLATFORM_ID)) return;
  const NOTIFY_KEY = 'lastNotificationLength';
  const SEEN_KEY = 'seenNotification';

  const currentLength = newList.length;
  const lastLength = Number(localStorage.getItem(NOTIFY_KEY) ?? 0);

  // لو فيه Notifications جديدة
  if (currentLength > lastLength) {
    this.hasNewNotify.set(true);
    localStorage.setItem(SEEN_KEY, 'false'); // لسه متشافوش
  } else {
    // لو مفيش جديد → اعتمد على الحالة المخزنة
    const seen = localStorage.getItem(SEEN_KEY) === 'true';
    this.hasNewNotify.set(!seen);
  }
  localStorage.setItem(NOTIFY_KEY, String(currentLength));
  this.adminNotifications.set(newList);
}
markAllAsSeen() {
  this.hasNewNotify.set(false);
  localStorage.setItem('seenNotification', 'true');
}
clearNewFlag() {
  this.hasNewNotify.set(false);
}
}
