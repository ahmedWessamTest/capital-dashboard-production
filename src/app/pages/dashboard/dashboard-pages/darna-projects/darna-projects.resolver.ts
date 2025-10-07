import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Project, ProjectResponse, ProjectsService, ProjectsListResponse } from './darna-projects.service';

export const projectsResolver: ResolveFn<Project | Project[] | ProjectResponse | null> = (route, state): Observable<Project | Project[] | ProjectResponse | null> => {
  const projectsService = inject(ProjectsService);
  const id = route.paramMap.get('id');
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show('actionsLoader');
  if (id) {
    return projectsService.getById(+id).pipe(
      catchError(() => of(null))
    );
  } else {
    return projectsService.getAll().pipe(
      map((response: ProjectsListResponse) => response.data),
      catchError(() => of([]))
    );
  }
};