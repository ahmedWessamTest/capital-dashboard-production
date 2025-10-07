import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { EnglishBlog } from '../../service/english-blogs.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-all-english-blogs',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-eng-blogs.component.html',
  styleUrl: './all-eng-blogs.component.scss'
})
export class AllEngBlogsComponent implements OnInit {
  blogs: EnglishBlog[] = [];

  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'main_image', header: 'Image', sortable: false, type: 'image' },
    { field: 'en_blog_title', header: 'Title', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show('actionsLoader');

    this.route.data.subscribe({
      next: (data) => {
        this.blogs = data['data'].data;
        this.blogs.forEach((blog) => {
          blog.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(blog.active_status);
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load English blogs', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}