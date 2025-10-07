import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorRequestComment, MotorRequestCommentsService } from '../../pages/dashboard/dashboard-pages/motors-comments/services/motors-comments.service';

@Injectable({
  providedIn: 'root'
})
export class MotorRequestCommentsResolver implements Resolve<{ success: boolean; message: string; data: MotorRequestComment[] }> {
  constructor(private commentsService: MotorRequestCommentsService, private ngxSpinnerService: NgxSpinnerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ success: boolean; message: string; data: MotorRequestComment[] }> {
    this.ngxSpinnerService.show('actionsLoader');
    const requestId = +route.paramMap.get('id')!;
    return this.commentsService.getAll(requestId);
  }
}