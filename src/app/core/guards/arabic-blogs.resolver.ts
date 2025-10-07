import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArabicBlogsListResponse, ArabicBlogResponse, ArabicBlogsService } from '../../pages/dashboard/dashboard-pages/arabic-blogs/service/arabic-blogs.service';

@Injectable({
  providedIn: 'root'
})
export class ArabicBlogsResolver implements Resolve<ArabicBlogsListResponse | ArabicBlogResponse> {
  constructor(
    private arabicBlogsService: ArabicBlogsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ArabicBlogsListResponse | ArabicBlogResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.arabicBlogsService.getById(+id);
    }
    return this.arabicBlogsService.getAll();
  }
}