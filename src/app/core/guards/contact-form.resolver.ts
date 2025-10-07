import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContactFormResponse, ContactFormsListResponse, ContactUsFormService } from '../../pages/dashboard/dashboard-pages/contact-form/services/contact-form.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ContactFormResolver implements Resolve<ContactFormResponse | ContactFormsListResponse> {
  constructor(  
    private contactFormService: ContactUsFormService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContactFormResponse | ContactFormsListResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    // console.log("id",id)
    if (id) {
      console.log("id",id)
        return this.contactFormService.getById(+id);
    }
    // return this.contactFormService.getAll();
    return this.contactFormService.getAll();
  }
}