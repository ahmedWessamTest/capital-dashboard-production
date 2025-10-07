// import { Component } from '@angular/core';
// import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
// import { CategoriesService, Category } from '../../services/categories.service';
// import { Column } from '../../../../../../shared/service/genereic-table.service';

// @Component({
//   selector: 'app-all-categories',
//   standalone: true,
//   imports: [GenericTableComponent],
//   templateUrl: './all-categories.component.html',
//   styleUrl: './all-categories.component.scss'
// })
// export class AllCategoriesComponent {
//   categories: Category[] = []; // Populated via CategoriesService

//   columns: Column[] = [
//     { field: 'id', header: 'ID Categories', sortable: true, type: 'text' },
//     { field: 'en_title', header: 'English Title', sortable: true, type: 'text', maxLength: 30 },
//     { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
//     {
//       field: 'network_link',
//       header: 'Link',
//       type: 'link',
//     }
//   ];

//   constructor(private categoriesService: CategoriesService) {
//     this.fetchCategories();
//   }

//   fetchCategories() {
//     this.categoriesService.getAll().subscribe({
//       next: (response) => {
//         this.categories = response.data;
//         this.categories.forEach((category) => {
//           category.active_status = this.normalizeActiveStatus(category.active_status);
//         });
//       },
//       error: (err) => {
//         console.error('Failed to load categories', err);
//       }
//     });
//   }
//   private normalizeActiveStatus(status: any): boolean {
//     if (typeof status === 'boolean') return status;
//     if (typeof status === 'string') return status === '1' || status.toLowerCase() === 'true';
//     return status === 1;
//   }
// }


import { NormalizeActiveStatusService } from './../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { Category } from '../../services/categories.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.scss'
})
export class AllCategoriesComponent implements OnInit {
  categories: Category[] = [];

  columns: Column[] = [
    { field: 'id', header: 'ID Categories', sortable: true, type: 'text' },
    { field: 'en_title', header: 'English Title', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    {
      field: 'network_link',
      header: 'Link',
      type: 'link',
    },
    { field: 'active_status', header: 'Status', sortable: true, type: 'boolean',displayFn(item){
      return item.active_status ? "Enabled" : "Disabled"
    } },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.categories = data['data'].data.map((category: any) => {
          return {
            ...category,
            active_status: this.normalizeActiveStatusService.normalizeActiveStatus(category.active_status)
          };
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}