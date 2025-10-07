import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { TestimonialsListResponse, TestimonialResponse, TestimonialsService } from '../../pages/dashboard/dashboard-pages/testimonials/services/testimonial.service';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsResolver implements Resolve<TestimonialsListResponse | TestimonialResponse> {
  constructor(
    private testimonialsService: TestimonialsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestimonialsListResponse | TestimonialResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.testimonialsService.getById(+id);
    }
    return this.testimonialsService.getAll();
  }
}