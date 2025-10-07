import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogsService, Blog, BlogResponse, BlogsListResponse } from './darna-blogs.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

export const darnaBlogsResolver: ResolveFn<Blog | Blog[] | BlogResponse | null> = (route, state): Observable<Blog | Blog[] | BlogResponse | null> => {
  const blogsService = inject(BlogsService);
  const id = route.paramMap.get('id');
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show('actionsLoader');
  if (id) {
    return blogsService.getById(+id).pipe(
      catchError(() => of(null))
    );
  } else {
    return blogsService.getAll().pipe(
      map((response: BlogsListResponse) => response.data),
      catchError(() => of([]))
    );
  }
};