import { NormalizeActiveStatusService } from './../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { AboutCounter } from '../../services/counters.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-counters',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-counters.component.html',
  styleUrl: './all-counters.component.scss'
})
export class AllCountersComponent implements OnInit {
  counters: AboutCounter[] = [];
  
  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'en_name', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'counter_value', header: 'Counter Value', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
    { field: 'active_status', header: 'Status', sortable: true, type: 'boolean',displayFn(item){      
      return item.active_status ? "Enabled" : "Disabled"
    } },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute
    ,private NormalizeActiveStatusService:NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.counters = data['counters'].data.map((counter: any) => {
          return {
            ...counter,
            active_status: this.NormalizeActiveStatusService.normalizeActiveStatus(counter.active_status)
          };
        });
        
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load counters', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}