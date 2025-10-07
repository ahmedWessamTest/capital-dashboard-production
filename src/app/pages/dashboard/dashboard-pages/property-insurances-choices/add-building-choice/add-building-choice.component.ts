import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../../../core/services/validation/form-validators.service';
import { GenericFormComponent, FormField } from '../../../../../shared/components/generic-add/generic-add.component';
import { BuildingInsurance } from '../../property-insurance/services/property-insurance.service';
import { BuildingInsuranceChoicesService } from '../services/property-insurances-choices.service';

@Component({
  selector: 'app-add-building-choice',
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
  templateUrl: './add-building-choice.component.html',
  styleUrls: ['./add-building-choice.component.scss'],
  providers: [MessageService]
})
export class AddBuildingChoiceComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;
  data: any = null;
  buildingInsuranceID: string | null = null;
  extraFormData: { [key: string]: string | number } = {};
  buildingInsurances: any[] = [];
  buildingInsuranceOptions: { label: string; value: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private buildingInsuranceChoicesService: BuildingInsuranceChoicesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.data.subscribe({
      next: ({ data }) => {
        console.log("from building insurance data", data);
        console.log("data", data.data);
        console.log("buildingInsurances", this.buildingInsurances);
        // Create options for dropdown
        this.buildingInsuranceOptions = data.data.map((insurance: BuildingInsurance) => ({
          label: `${insurance.company_name} - ${insurance.en_title}`,
          value: insurance.id
        }));

        console.log("buildingInsuranceOptions", this.buildingInsuranceOptions);
      },
      error: (err) => {
        console.error('Failed to load buildingInsurances', err);
        this.ngxSpinnerService.hide('actionsLoader');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load building insurances' });
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
        name: 'building_insurance_id',
        label: 'Building Insurance',
        type: 'dropdown',
        required: true,
        options: this.buildingInsuranceOptions,
        placeholder: 'Select Building Insurance'
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