import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { PrimeNGConfig } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MotorInsuranceChoicesService } from '../../services/motor-insurances-choices.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormField, GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { MotorInsurance } from '../../../motor-insurance/services/motor-insurance.service';

@Component({
  selector: 'app-add-motor-choice',
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
    GenericFormComponent
  ],
  templateUrl: './add-motor-choice.component.html',
  styleUrls: ['./add-motor-choice.component.scss'],
  providers: [MessageService]
})
export class AddMotorChoiceComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;
  motorInsuranceID: string | null = null;
  extraFormData: { [key: string]: string | number } = {};
  motorInsurances: any[] = [];
  motorInsuranceOptions: { label: string; value: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private motorInsuranceChoicesService: MotorInsuranceChoicesService
  ) {}

  ngOnInit() {
    this.route.data.subscribe({
      next: (data:any) => {

        this.motorInsuranceOptions = data.data.motorInsurances?.data.map((insurance: MotorInsurance) => ({
          label: `${insurance.company_name} - ${insurance.en_title}`,
          value: insurance.id
        }));
      },
      error: (err) => {
        console.error('Failed to load motor insurances', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });

    this.initializeFields();
    this.ngxSpinnerService.hide('actionsLoader');
  }

  initializeFields() {
    this.formFields = [
      {
        name: 'motor_insurance_id',
        label: 'Motor Insurance',
        type: 'dropdown',
        required: true,
        options: this.motorInsuranceOptions,
        placeholder: 'Select Motor Insurance'
      },
      {
        name: 'en_title',
        label: 'English Title',
        type: 'text',
        required: true,
        placeholder: 'English Title'
      },
      {
        name: 'ar_title',
        label: 'Arabic Title',
        type: 'text',
        required: true,
        placeholder: 'Arabic Title'
      },
      {
        name: 'en_description',
        label: 'English Description',
        type: 'text',
        required: true,
        placeholder: 'English Description'
      },
      {
        name: 'ar_description',
        label: 'Arabic Description',
        type: 'text',
        required: true,
        placeholder: 'Arabic Description'
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true
      }
    ];
  }
}