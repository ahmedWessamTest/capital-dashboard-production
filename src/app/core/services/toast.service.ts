import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastConfig {
  type: string; // 'success' | 'error' | 'info' | 'warning'
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastConfig | null>(null);
  toasts$ = this.toastsSubject.asObservable();

  showToast(type: string, msg: string, position:'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'topRight') {
    this.toastsSubject.next({ type, position, msg });
  }
}