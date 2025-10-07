import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ValidationService } from '../../../../../core/services/validation/form-validators.service';
import {
  FormField,
  GenericFormComponent,
} from '../../../../../shared/components/generic-add/generic-add.component';
import { IJopPolicy } from '../../a-jop-insurance/jop-insurance';
import { JopInsuranceChoicesService } from '../services/jop-insurances-choices.service';

@Component({
  selector: 'app-add-jop-choice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    ButtonModule,
    ToastModule,
    GenericFormComponent,
  ],
  templateUrl: './add-jop-choice.component.html',
  styleUrls: ['./add-jop-choice.component.scss'],
  providers: [MessageService],
})
export class AddJopChoiceComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;
  data: any = null;
  jopInsuranceID: string | null = null;
  extraFormData: { [key: string]: string | number } = {};
  jopInsurances: any[] = [];
  jopInsuranceOptions: { label: string; value: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private jopInsuranceChoicesService: JopInsuranceChoicesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Set the category_id for job insurance
    this.extraFormData = {
      category_id: '5', // Job insurance category ID
    };

    this.route.data.subscribe({
      next: ({ data }) => {
        console.log('from jop insurance data', data);
        console.log('data', data.data);
        console.log('jopInsurances', this.jopInsurances);
        // Create options for dropdown
        this.jopInsuranceOptions = data.data.map((insurance: IJopPolicy) => ({
          label: `${insurance.company_name} - ${insurance.en_title}`,
          value: insurance.id,
        }));

        console.log('jopInsuranceOptions', this.jopInsuranceOptions);
        this.initializeFields(); // Initialize fields after data is loaded
      },
      error: (err) => {
        console.error('Failed to load jopInsurances', err);
        this.ngxSpinnerService.hide('actionsLoader');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Professional insurances',
        });
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }

  initializeFields() {
    this.formFields = [
      {
        name: 'jop_insurance_id',
        label: 'Professional Insurance',
        type: 'dropdown',
        required: true,
        options: this.jopInsuranceOptions,
        placeholder: 'Select Professional Insurance',
      },
      {
        name: 'en_title',
        label: 'English Title',
        type: 'text',
        required: true,
        placeholder: 'English Title',
      },
      {
        name: 'ar_title',
        label: 'Arabic Title',
        type: 'text',
        required: true,
        placeholder: 'Arabic Title',
      },
      {
        name: 'en_description',
        label: 'English Description',
        type: 'text',
        required: true,
        placeholder: 'English Description',
      },
      {
        name: 'ar_description',
        label: 'Arabic Description',
        type: 'text',
        required: true,
        placeholder: 'Arabic Description',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true,
      },
    ];
  }
}
