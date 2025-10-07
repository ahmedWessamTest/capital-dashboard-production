import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Keep ReactiveFormsModule
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalInsurance, MedicalRequest } from '../../../medical-requests/services/medical-requests.service';
import { MedicalRequestsService } from '../../services/medical-requests.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { FormField, GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
// import { MedicalCategoriesInsuranceData } from '../../../../../../core/guards/medical-catgories-insurance.resolver'; // This import seems unused and might be specific to your project setup

@Component({
  selector: 'app-add-edit-medical-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Keep ReactiveFormsModule
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    ButtonModule,
    ToastModule,
    GenericFormComponent
  ],
  templateUrl: './add-edit-medical-requests.component.html',
  styleUrls: ['./add-edit-medical-requests.component.scss'],
  providers: [MessageService]
})
export class AddEditMedicalRequestsComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: MedicalRequest | null = null;
  medicalRequestId: string | null = null;
  medicalInsurances: MedicalInsurance[] = [];
  medicalInsuranceOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService, // You might not need this here if it's only used in GenericFormComponent
    private ngxSpinnerService: NgxSpinnerService,
    private medicalRequestsService: MedicalRequestsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.medicalRequestId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.medicalRequestId;

    this.route.data.subscribe({
      next: (data: any) => {
        if (data) {          
          this.medicalInsurances = data.data?.medicalInsurances?.data || [];
          console.log("data",this.medicalInsurances)
          if (this.isEditMode && data.data?.medicalRequest) {
            this.editData = data.data?.medicalRequest?.data;
            if (this.editData?.medical_insurance_id) {
                this.editData.medical_insurance_id = Number(this.editData.medical_insurance_id);
            }
            if(this.editData){
              this.extraFormData = {
                user_id: this.editData.user_id,
                 medical_insurance_id: this.editData.medical_insurance_id,
                 payment_method: this.editData.payment_method ||"Cash",
              }
            }
          }

          this.medicalInsuranceOptions = this.medicalInsurances.map(insurance => ({
            label: `${insurance.company_name} - ${insurance.en_title}`,
            value: insurance.id.toString(),
          }));
console.log(data?.data?.medicalRequest?.data);

          this.initializeFields(data?.data?.medicalRequest?.data?.request_type);
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load required data'
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  initializeFields(type:any) {
    // Get the current status from editData if in edit mode
    const currentStatus = this.isEditMode && this.editData ? this.editData.active_status : null;
      // Define status options and filter out "canceled" if status is "confirmed"
    const statusOptions = [
      { label: 'Requested', value: 'requested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Canceled', value: 'canceled' }
    ].filter(option => currentStatus !== 'confirmed' || option.value !== 'canceled');
  if(type === "corporate-empolyee" || type === "corporate") {
    this.formFields = [
      {
        name: 'admin_medical_insurance_number',
        label: 'Admin Medical Insurance Number',
        type: 'text',
        required: true,
        placeholder: 'Enter Admin Medical Insurance Number',
      },
      {
        name: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        placeholder: 'Select Start Date',
        showIf:{filed:"active_status",value:'confirmed'}
      },
      {
        name: 'duration',
        label: 'Duration (Years)',
        type: 'dropdown',
        required: true,
        placeholder: 'Enter Duration in Years',
        showIf:{filed:"active_status",value:'confirmed'}
      },
      {
        name: 'company_address',
        label: 'Company Address',
        type: 'text',
        required: true,
        disabled:true,
        placeholder: 'Enter address',
      },
      {
        name: 'company_employee_number',
        label: 'Number Of Employee',
        type: 'text',
        required: true,
        disabled:true,
        placeholder: 'Enter address',
      },
      {
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true,
        disabled:true,
        placeholder: 'Enter address',
      },

      {
        name: 'end_date',
        label: 'End Date',
        type: 'date',
        required: true,
        placeholder: 'Select End Date',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'dropdown',
        required: true,
        options: statusOptions, // Use filtered status options
        placeholder: 'Select Status',
      },
      {
        name: 'medical_insurance_number',
        label: 'Medical Insurance Number',
        type: 'text',
        required: true,
        placeholder: 'Enter Medical Insurance Number',
        disabled: true,
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter Name',
        disabled: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        placeholder: 'Enter Email',
        disabled: true,
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        required: true,
        placeholder: 'Enter Phone Number',
        disabled: true,
      },
      {
        name: 'medical_insurance_id',
        label: 'Medical Insurance',
        type: 'dropdown',
        required: true,
        options: this.medicalInsuranceOptions,
        placeholder: 'Select Medical Insurance',
        disabled:true
      },
      {
        name: 'payment_method',
        label: 'Payment Method',
        type: 'text',
        required: true,
        placeholder: 'Select Payment Method',
        disabled: true,
      },
    ];
  } else {
    this.formFields = [
      {
        name: 'admin_medical_insurance_number',
        label: 'Admin Medical Insurance Number',
        type: 'text',
        required: true,
        placeholder: 'Enter Admin Medical Insurance Number',
      },
      {
        name: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        placeholder: 'Select Start Date',
        showIf:{filed:"active_status",value:'confirmed'}
      },
      {
        name: 'duration',
        label: 'Duration (Years)',
        type: 'dropdown',
        required: true,
        placeholder: 'Enter Duration in Years',
        showIf:{filed:"active_status",value:'confirmed'}
      },
      {
        name: 'end_date',
        label: 'End Date',
        type: 'date',
        required: true,
        placeholder: 'Select End Date',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'dropdown',
        required: true,
        options: statusOptions, // Use filtered status options
        placeholder: 'Select Status',
      },
      {
        name: 'medical_insurance_number',
        label: 'Medical Insurance Number',
        type: 'text',
        required: true,
        placeholder: 'Enter Medical Insurance Number',
        disabled: true,
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter Name',
        disabled: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        placeholder: 'Enter Email',
        disabled: true,
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        required: true,
        placeholder: 'Enter Phone Number',
        disabled: true,
      },
      {
        name: 'birthdate',
        label: 'Birthdate',
        type: 'date',
        required: true,
        disabled: true,
        placeholder: 'Select Birthdate'
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'dropdown',
        required: true,
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ],
        placeholder: 'Select Gender',
        disabled: true,
      },
      {
        name: 'medical_insurance_id',
        label: 'Medical Insurance',
        type: 'dropdown',
        required: true,
        options: this.medicalInsuranceOptions,
        placeholder: 'Select Medical Insurance',
        disabled: true,
      },
      {
        name: 'payment_method',
        label: 'Payment Method',
        type: 'text',
        required: true,
        placeholder: 'Select Payment Method',
        disabled: true,
      },
    ];
  }
  }
}