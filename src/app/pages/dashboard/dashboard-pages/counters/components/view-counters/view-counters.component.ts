import { Data } from './../../../../../../core/Interfaces/q-sub-categories/IUpdateSubCategoriesResponse';
import { Component, OnInit } from '@angular/core';
import { AboutCounter, AboutCountersService } from '../../services/counters.service';
import { ActivatedRoute } from '@angular/router';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-view-counter',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-counters.component.html',
  styleUrl: './view-counters.component.scss'
})
export class ViewCountersComponent implements OnInit {
  counter: AboutCounter | null = null;

  columns: Column[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'en_name', header: 'English Name', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'date' },
    { field: 'active_status', header: 'Status', type: 'boolean' },
  ];

  constructor(
    private countersService: AboutCountersService,
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        console.log(data)
        this.counter = data['counter'].row;
        if(this.counter){
          this.counter.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(this.counter.active_status);
        }
        console.log("form Counters Page",this.counter)
      },
      error: (err) => {
        console.error('Failed to load counter', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}