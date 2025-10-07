import { Component } from '@angular/core';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { Client } from '../../services/clients.service';

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-client.component.html',
  styleUrl: './view-client.component.scss'
})
export class ViewClientComponent {
client:  Client | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Client ID ', type: 'text' },
    { field: 'en_client_name', header: 'English Client Name', type: 'text' },
    { field: 'ar_client_name', header: 'Arabic Client Name', type: 'text' },
    { field: 'client_image', header: 'Client Image', type: 'image' },

  
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    console.log('ViewClientComponent initialized');
    
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);
        
        // Handle different response structures
        const clientData = data['data'];
        console.log('Client resolver data:', clientData);
        
        if (clientData) {
          // Check if the response has a 'data' property (API wrapper)
          this.client = clientData.data || clientData;
          console.log('Assigned client:', this.client);
        } else {
          console.warn('No client data found in route data');
        }
        
        // Hide spinner after processing data
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load client:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}
