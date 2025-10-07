import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Category } from '../../../categories/services/categories.service';
import { BuildingLead } from '../../services/building-lead.service';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";

interface SelectOption {
  label: string;
  value: string; // Changed to string to match dropdown values
}
@Component({
  selector: 'app-all-building-lead',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-building-lead.component.html',
  styleUrl: './all-building-lead.component.scss'
})
export class AllBuildingLeadComponent {
  buildingLeads: BuildingLead[] = []; // Populated via CategoriesService
categories:Category[]=[]
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'phone', header: 'Phone', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'need_call', header: 'Need Call', sortable: false },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    { field: 'category_id', header: 'Category', sortable: false ,displayFn(item) {
      return item.category?.en_title || "No Category";
    }},
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}
  ngOnInit(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.buildingLeads = data.buildingLeads;
        this.categories = data.categories;
      },
      error: (err) => {
        console.error('Failed to load buildingLeads', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
      }
    });
    this.ngxSpinnerService.hide('actionsLoader');

  }

  get categoryOptions(): SelectOption[] {
    return this.categories.map(c => ({
      label: c.en_title,
      value: c.id.toString()
    }));
  }
}
