import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BlogsService, Blog } from '../darna-blogs.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-darna-blogs',
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
  templateUrl: './all-darna-blogs.component.html'
})
export class AllDarnaBlogsComponent implements OnInit {
  private blogsService = inject(BlogsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  public router = inject(Router);

  blogs: Blog[] = [];
  message = { text: '', type: '' };

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.ngxSpinnerService.show('actionsLoader');
    this.blogsService.getAll().subscribe({
      next: (response) => {
        this.blogs = response.data;
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: () => {
        this.message = { text: 'Failed to load blogs', type: 'error' };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      }
    });
  }

  onStatusChange(blog: Blog, event: any) {
    this.ngxSpinnerService.show('actionsLoader');
    const action = blog.active_status === '1' ? this.blogsService.enable(blog.id) : this.blogsService.disable(blog.id);
    
    action.subscribe({
      next: () => {
        this.message = { 
          text: blog.active_status === '1' ? 'Blog enabled successfully' : 'Blog disabled successfully', 
          type: 'success' 
        };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      },
      error: () => {
        blog.active_status = blog.active_status === '1' ? '0' : '1';
        this.message = { text: 'Failed to update status', type: 'error' };
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => this.message = { text: '', type: '' }, 5000);
      }
    });
  }
}