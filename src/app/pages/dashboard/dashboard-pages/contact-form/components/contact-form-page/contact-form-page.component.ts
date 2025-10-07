import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { ContactForm } from '../../services/contact-form.service';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";

@Component({
  selector: 'app-contact-form-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contact-form-page.component.html',
  styleUrl: './contact-form-page.component.scss'
})
export class ContactFormPageComponent {

}
