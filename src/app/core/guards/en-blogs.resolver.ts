import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnglishBlogResponse, EnglishBlogsListResponse, EnglishBlogsService } from '../../pages/dashboard/dashboard-pages/english-blogs/service/english-blogs.service';

@Injectable({
  providedIn: 'root'
})
export class EnglishBlogsResolver implements Resolve<EnglishBlogsListResponse | EnglishBlogResponse> {
  constructor(
    private englishBlogsService: EnglishBlogsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EnglishBlogsListResponse | EnglishBlogResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.englishBlogsService.getById(+id);
    }
    return this.englishBlogsService.getAll();
  }
}