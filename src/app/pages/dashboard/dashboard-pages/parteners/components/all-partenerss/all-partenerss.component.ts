// import { Column, GenericDataService } from '../../../../../../shared/service/genereic-table.service';
// import { Partner, PartnersService } from './../../services/parteners.service';
// import { Component } from '@angular/core';
// import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";import { CategoriesService, Category } from '../../../categories/services/categories.service';
// import { NgxSpinnerService } from 'ngx-spinner';


// interface SelectOption {
//   label: string;
//   value: string; // Changed to string to match dropdown values
// }

// @Component({
//   selector: 'app-all-partenerss',
//   standalone: true,
//   imports: [GenericTableComponent],
//   templateUrl: './all-partenerss.component.html',
//   styleUrl: './all-partenerss.component.scss',
// })
// export class AllPartenerssComponent {
//   partners: Partner[] = []; // Populated via CategoriesService
//   categories: Category[] = []; // Populated via CategoriesService
//   columns: Column[] = [
//     { field: 'id', header: 'ID Partner', sortable: true, type: 'text' },
//     {
//       field: 'partner_image',
//       header: 'Image',
//       type: 'image',
//       sortable: false,
//     },
//     { field: 'en_partner_name', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
//     { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
//     // {field:'active_status',header:"Satatus",sortable:true,type:'text'},
//     // { field: 'category.en_title', header: 'Category', sortable: false, type: 'text' },
//     { 
//       field: 'category_id', 
//       header: 'Category', 
//       sortable: false, 
//       type: 'text',
//       displayFn: (item: Partner) => item.category?.en_title || 'No category' 
//     }
    
//   ];

//   constructor(private partnersService:PartnersService,private categoriesService:CategoriesService,private ngxSpinnerService:NgxSpinnerService) {
//     this.fetchPartners();
//     this.fetchCategories();
//   }

//   fetchPartners() {
//     this.ngxSpinnerService.show('actionsLoader');
//     this.partnersService.getAll().subscribe({
//       next: (response) => {
//         this.partners = response.data;
//         this.partners.forEach((partner) => {
//           partner.active_status = this.normalizeActiveStatus(partner.active_status);
//         });
//         console.table(this.partners)
//       },
//       error: (err) => {
//         console.error('Failed to load categories', err);
//       }
//     });
//     this.ngxSpinnerService.hide('actionsLoader');

//   }



//   fetchCategories() {
//     this.categoriesService.getAll().subscribe({
//       next: (response) => {
//         this.categories = response.data;
//         this.categories.forEach((category) => {
//           category.active_status = this.normalizeActiveStatus(category.active_status);
//         });
//         console.table(this.categories)
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
//   // In all-partenerss.component.ts, add a computed property for categoryOptions:
// get categoryOptions(): SelectOption[] {
//   return this.categories.map(category => ({
//     label: category.en_title,
//     value: category.id.toString()
//   }));
// }

// }


import { NormalizeActiveStatusService } from './../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { Partner } from './../../services/parteners.service';
import { Category } from '../../../categories/services/categories.service'; // Ensure Category is imported
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-all-partenerss',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-partenerss.component.html',
  styleUrl: './all-partenerss.component.scss',
})
export class AllPartenerssComponent implements OnInit {
  partners: Partner[] = [];
  categories: Category[] = []; // This will be populated by the resolver if available, otherwise fetched if needed for dropdown
  
  columns: Column[] = [
    { field: 'id', header: 'ID Partner', sortable: true, type: 'text' },
    {
      field: 'partner_image',
      header: 'Image',
      type: 'image',
      sortable: false,
    },
    { field: 'en_partner_name', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    { field: 'active_status', header: 'Status', sortable: true, type: 'boolean',displayFn(item){
      return item.active_status ? "Enabled" : "Disabled"
    } }, // Added active_status column

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
        if (data['data'] && data['data'].data) {
          this.partners = data['data'].data.map((partner: any) => {
            return {
              ...partner,
              active_status: this.normalizeActiveStatusService.normalizeActiveStatus(partner.active_status)
            };
          });
        }
        
        if (data['categories'] && data['categories'].data) {
            this.categories = data['categories'].data.map((category: any) => {
                return {
                    ...category,
                    active_status: this.normalizeActiveStatusService.normalizeActiveStatus(category.active_status)
                };
            });
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load data for partners or categories', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  // Computed property for categoryOptions
  get categoryOptions(): SelectOption[] {
    return this.categories.map(category => ({
      label: category.en_title,
      value: category.id.toString()
    }));
  }
}