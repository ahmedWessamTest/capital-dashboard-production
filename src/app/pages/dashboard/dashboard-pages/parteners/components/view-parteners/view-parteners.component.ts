import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Partner } from '../../services/parteners.service';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Category } from '../../../categories/services/categories.service';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-view-parteners',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-parteners.component.html',
  styleUrl: './view-parteners.component.scss'
})
export class ViewPartenersComponent implements OnInit {
  partner: Partner | null = null;
  categories: Category[] = [];
  columns: Column[] = [
    { field: 'id', header: 'Client ID', type: 'text' },
    { field: 'ar_partner_name', header: 'Arabic Partner Name', type: 'text' },
    { field: 'en_partner_name', header: 'English Partner Name', type: 'text' },
    { field: 'partner_image', header: 'Partner Image', type: 'image' },
    { field: 'active_status', header: 'Active Status', type: 'boolean' },
    { field: 'home_status', header: 'Home Active Status', type: 'boolean' },
    {
      field: 'category_id',
      header: 'Category',
      type: 'text',
      displayFn: (item: Partner) => item.category?.en_title || 'No category'
    },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'updated_at', header: 'Updated At', type: 'date' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) { }

  ngOnInit(): void {
    this.ngxSpinnerService.show('actionsLoader');
    this.route.data.subscribe({
      next: (data) => {
        const resolverData = data['data'];
        if (resolverData?.partner) {
          // Single partner case
          this.partner = {
            ...resolverData.partner.data,
            active_status: this.normalizeActiveStatusService.normalizeActiveStatus(resolverData.partner.data.active_status),
            category: resolverData.categories?.data.find((cat: Category) => cat.id === resolverData.partner.data.category_id)
          };
          this.categories = resolverData.categories?.data || [];
        }
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load partner:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}
