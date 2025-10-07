import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Category } from '../../services/categories.service';

@Component({
  selector: 'app-view-category',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent implements OnInit {
  category: Category | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Category ID', type: 'text' },
    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'en_slug', header: 'English Slug', type: 'text' },
    { field: 'ar_slug', header: 'Arabic Slug', type: 'text' },
    { field: 'en_small_description', header: 'English Small Description', type: 'text' },
    { field: 'ar_small_description', header: 'Arabic Small Description', type: 'text' },
    { field: 'en_main_description', header: 'English Main Description', type: 'text' },
    { field: 'ar_main_description', header: 'Arabic Main Description', type: 'text' },
    { field: 'network_link', header: 'Network Link', type: 'text' },
    { field: 'counter_number', header: 'Counter Number', type: 'text' },
    { field: 'en_meta_title', header: 'English Meta Title', type: 'text' },
    { field: 'ar_meta_title', header: 'Arabic Meta Title', type: 'text' },
    { field: 'en_meta_description', header: 'English Meta Description', type: 'text' },
    { field: 'ar_meta_description', header: 'Arabic Meta Description', type: 'text' },
    { field: 'active_status', header: 'Status', type: 'boolean' }
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    console.log('ViewCategoryComponent initialized');
    
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);
        console.log(data)
        const categoryData = data['data'];
        console.log('Category resolver data:', categoryData);
        
        if (categoryData) {
          this.category = categoryData.data || categoryData;
          console.log('Assigned category:', this.category);
        } else {
          console.warn('No category data found in route data');
        }
        
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load category:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}