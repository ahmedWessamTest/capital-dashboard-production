import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ArabicBlog } from '../../service/arabic-blogs.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-all-arabic-blogs',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-arabic-blogs.component.html',
  styleUrl: './all-arabic-blogs.component.scss'
})
export class AllArabicBlogsComponent implements OnInit {
  blogs: ArabicBlog[] = [];

  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'main_image', header: 'Image', sortable: false, type: 'image' },
    { field: 'ar_blog_title', header: 'Title', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    { field: 'active_status', header: 'Status', sortable: true, type: 'text',displayFn(item) {
      return item.active_status ? 'Enabled' : 'Disabled';
    } }
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
        console.error('Failed to load Arabic blogs', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}