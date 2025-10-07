import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { FormField, GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { BuildCountry } from '../../../build-countries/services/build-countries.service';
import { BuildType } from '../../../build-types/services/build-types.service';
import { BuildingInsurance } from '../../../property-insurance/services/property-insurance.service';
import { BuildingRequest, BuildingRequestsService } from '../../services/property-requests.service';

@Component({
  selector: 'app-add-edit-property-requests',
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
  templateUrl: './add-edit-property-requests.component.html',
  styleUrls: ['./add-edit-property-requests.component.scss'],
  providers: [MessageService]
})
export class AddEditPropertyRequestsComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: BuildingRequest | null = null;
  buildingRequestId: string | null = null;
  buildingInsurances: BuildingInsurance[] = [];
  buildingInsuranceOptions: { label: string; value: string }[] = [];
  buildTypes: BuildType[] = [];
  buildTypeOptions: { label: string; value: string }[] = [];
  buildCountries: BuildCountry[] = [];
  buildCountryOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private buildingRequestsService: BuildingRequestsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.buildingRequestId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.buildingRequestId;

    this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data) {
          this.buildingInsurances = data.data.buildingInsurances?.data || [];
          this.buildTypes = data.data.buildTypes?.data || [];
          this.buildCountries = data.data.buildCountries?.data || [];

          if (this.isEditMode && data.data.buildingRequest) {
            this.editData = data.data.buildingRequest.data;
            if (this.editData?.building_insurance_id) {
              this.editData.building_insurance_id = Number(this.editData.building_insurance_id);
            }
            if (this.editData) {
              this.extraFormData = {
                user_id: this.editData.user_id,
              };
            }
          }

          this.buildingInsuranceOptions = this.buildingInsurances.map(insurance => ({
            label: `${insurance.company_name} - ${insurance.en_title}`,
            value: insurance.id.toString(),
          }));

          this.buildTypeOptions = this.buildTypes.map(type => ({
            label: type.en_title,
            value: type.id.toString()
          }));

          this.buildCountryOptions = this.buildCountries.map(country => ({
            label: country.en_title,
            value: country.id.toString()
          }));
          this.initializeFields(data?.data?.buildingRequest?.data?.request_type);
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
    // Define status steps to determine order
    const statusSteps = ['requested', 'pending', 'confirmed', 'canceled'];
    // Get the current status from editData if in edit mode
    const currentStatus = this.isEditMode && this.editData ? this.editData.active_status : null;
    const currentIndex = currentStatus ? statusSteps.indexOf(currentStatus) : -1;

    // Define status options and filter based on index and confirmed status
    const statusOptions = [
      { label: 'Requested', value: 'requested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Canceled', value: 'canceled' }
    ].filter(option => {
      const optionIndex = statusSteps.indexOf(option.value);
      // Hide "canceled" if status is "confirmed"
      if (currentStatus === 'confirmed' && option.value === 'canceled') {
        return false;
      }
      // Only include options with equal or higher index than current status
      return !this.isEditMode || currentIndex === -1 || optionIndex >= currentIndex;
    });
    console.log(type);
    
    if(type ==="corporate" || type === "company-corporate") {
      this.formFields = [
        {
          name: 'admin_building_insurance_number',
          label: 'Admin Building Insurance Number',
          type: 'text',
          required: true,
          placeholder: 'Enter Admin Building Insurance Number',
          
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
          options: statusOptions,
          placeholder: 'Select Status',
        },
        {
          name: 'building_insurance_id',
          label: 'Building Insurance',
          type: 'dropdown',
          required: true,
          options: this.buildingInsuranceOptions,
          placeholder: 'Select Building Insurance',
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
          name: 'building_insurance_number',
          label: 'Building Insurance Number',
          type: 'text',
          required: true,
          placeholder: 'Enter Building Insurance Number',
          disabled: true,
        },
        {
          name: 'company_name',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'Enter Company Name',
          disabled: true,
        },
        {
          name: 'company_address',
          label: 'Company Address',
          type: 'text',
          required: true,
          placeholder: 'Enter Company Address',
          disabled: true,
        },
        {
          name: 'company_building_number',
          label: 'Number Of Buildings',
          type: 'text',
          required: true,
          placeholder: 'Enter Number of Buildings',
          disabled: true,
        },
        {
          name: 'building_type',
          label: 'Buildings Type',
          type: 'text',
          required: true,
          placeholder: 'Enter Building Insurance Number',
          disabled: true,
        },
        {
          name: 'company_building_total_money',
          label: 'Building Prices',
          type: 'text',
          required: true,
          placeholder: 'Enter Building Price',
          disabled: true,
        },
      ];
    } else {
      this.formFields = [
        {
          name: 'admin_building_insurance_number',
          label: 'Admin Building Insurance Number',
          type: 'text',
          required: true,
          placeholder: 'Enter Admin Building Insurance Number',
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
          options: statusOptions,
          placeholder: 'Select Status',
        },
        {
          name: 'building_insurance_id',
          label: 'Building Insurance',
          type: 'dropdown',
          required: true,
          options: this.buildingInsuranceOptions,
          placeholder: 'Select Building Insurance',
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
          name: 'building_insurance_number',
          label: 'Building Insurance Number',
          type: 'text',
          required: true,
          placeholder: 'Enter Building Insurance Number',
          disabled: true,
        },
        {
          name: 'building_price',
          label: 'Building Price',
          type: 'text',
          required: true,
          placeholder: 'Enter Building Price',
          disabled: true,
        },
      ];

    }
  }
}