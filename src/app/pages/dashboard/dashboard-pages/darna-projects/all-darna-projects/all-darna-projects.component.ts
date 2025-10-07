import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectsService } from '../darna-projects.service';

@Component({
  selector: 'app-all-darna-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxSpinnerModule,
    TableModule,
    InputSwitchModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './all-darna-projects.component.html'
})
export class AllDarnaProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  public router = inject(Router);

  projects: Project[] = [];
  message = { text: '', type: '' };

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.ngxSpinnerService.show('actionsLoader');
    this.projectsService.getAll().subscribe({
      next: (response) => {
        this.projects = response.data;
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: () => {
        this.message = { text: 'Failed to load projects', type: 'error' };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      }
    });
  }

  onStatusChange(project: Project, event: any) {
    this.ngxSpinnerService.show('actionsLoader');
    const action = project.active_status === '1' || project.active_status === true 
      ? this.projectsService.disable(project.id) 
      : this.projectsService.enable(project.id);
    
    action.subscribe({
      next: () => {
        this.message = { 
          text: (project.active_status === '1' || project.active_status === true) 
            ? 'Project disabled successfully' 
            : 'Project enabled successfully', 
          type: 'success' 
        };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      },
      error: () => {
        project.active_status = (project.active_status === '1' || project.active_status === true) ? '0' : '1';
        this.message = { text: 'Failed to update status', type: 'error' };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      }
    });
  }
}