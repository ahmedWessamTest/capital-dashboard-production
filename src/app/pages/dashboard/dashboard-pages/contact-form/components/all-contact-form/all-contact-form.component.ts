import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ContactForm } from '../../services/contact-form.service';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";

@Component({
  selector: 'app-all-contact-form',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './all-contact-form.component.html',
  styleUrl: './all-contact-form.component.scss'
})
export class AllContactFormComponent {
  contactForms: ContactForm[] = []; // Populated via CategoriesService

  columns: Column[] = [
    
    { field: 'name', header: 'Name', sortable: true, type: 'text', maxLength: 30 },
    { field: 'email', header: 'Email', sortable: true, type: 'text', maxLength: 30 },
    { field: 'phone', header: 'Phone', sortable: true, type: 'text', maxLength: 30 },
    { field: 'message', header: 'Message', sortable: true, type: 'text', maxLength: 30 },
    { field: 'created_at', header: 'Created At', sortable: true, type: 'date' },
  ];

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.hide('actionsLoader');

    this.route.data.subscribe({

      next: (data) => {
        this.contactForms = data['data'].data;
        console.log(this.contactForms)
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load contact forms', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }
}
