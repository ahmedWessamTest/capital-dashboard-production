import { Component } from '@angular/core';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { ActivatedRoute } from '@angular/router';
import { ContactForm } from '../../services/contact-form.service';
import { GenericViewComponent } from "../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component";
@Component({
  selector: 'app-view-contact-form',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-contact-form.component.html',
  styleUrl: './view-contact-form.component.scss'
})
export class ViewContactFormComponent {
  contactForm: ContactForm | null = null;

  columns: Column[] = [
    { field: 'id', header: 'ID', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'phone', header: 'Phone', type: 'text' },
    { field: 'message', header: 'Message', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'date' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        console.log(data)
        this.contactForm = data['data'].data;
        console.log("form Contact Form Page",this.contactForm)
      },
      error: (err) => {
        console.error('Failed to load contact form', err);
      }
    });
    this.ngxSpinnerService.hide("actionsLoader");
  }
}
