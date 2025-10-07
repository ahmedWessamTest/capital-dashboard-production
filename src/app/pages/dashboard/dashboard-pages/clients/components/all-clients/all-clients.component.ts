import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Client } from '../../services/clients.service';

@Component({
  selector: 'app-all-clients',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-clients.component.html',
  styleUrl: './all-clients.component.scss'
})
export class AllClientsComponent implements OnInit {
  clients: Client[] = [];

  columns: Column[] = [
    { field: 'id', header: 'ID', sortable: true, type: 'text' },
    { field: 'client_image', header: 'Image', sortable: false, type: 'image' },
    { field: 'en_client_name', header: 'English Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'ar_client_name', header: 'Arabic Name', sortable: true, type: 'text', maxLength: 30 },
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
        this.clients = data['data'].data;
        this.clients.forEach((client) => {
          client.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(client.active_status);
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}