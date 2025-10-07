import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import {
  FormField,
  GenericFormComponent,
} from '../../../../../../shared/components/generic-add/generic-add.component';
import { CarBrand } from '../../../car-brands/services/car-brands.service';
import { CarModel } from '../../../car-model/services/car-model.service';
import { CarType } from '../../../car-types/services/car-types.service';
import { CarYear } from '../../../car-years/services/car-years.service';
import {
  MotorInsurance,
  MotorRequest,
  MotorRequestsService,
} from '../../services/motors-requests.service';

@Component({
  selector: 'app-add-edit-motor-requests',
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
  templateUrl: './add-edit-motors-requests.component.html',
  styleUrls: ['./add-edit-motors-requests.component.scss'],
  providers: [MessageService],
})
export class AddEditMotorsRequestsComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: MotorRequest | null = null;
  motorRequestId: string | null = null;
  motorInsurances: MotorInsurance[] = [];
  motorInsuranceOptions: { label: string; value: string }[] = [];
  carTypes: CarType[] = [];
  carTypeOptions: { label: string; value: string }[] = [];
  carBrands: CarBrand[] = [];
  carBrandOptions: { label: string; value: string }[] = [];
  carModels: CarModel[] = [];
  carModelOptions: { label: string; value: string }[] = [];
  carYears: CarYear[] = [];
  carYearOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private motorRequestsService: MotorRequestsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.motorRequestId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.motorRequestId;

    this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data) {
          this.motorInsurances = data.data.motorInsurances?.data || [];
          this.carTypes = data.data.carTypes?.data || [];
          this.carBrands = data.data.carBrands?.data || [];
          this.carModels = data.data.carModels?.data || [];

          if (this.isEditMode && data.data.motorRequest) {
            this.editData = data.data.motorRequest.data;
            if (this.editData?.motor_insurance_id) {
              this.editData.motor_insurance_id = Number(
                this.editData.motor_insurance_id
              );
            }
            if (this.editData) {
              this.extraFormData = {
                user_id: this.editData.user_id,
              };
            }
          }

          this.motorInsuranceOptions = this.motorInsurances.map(
            (insurance) => ({
              label: `${insurance.company_name} - ${insurance.en_title}`,
              value: insurance.id.toString(),
            })
          );

          this.carTypeOptions = this.carTypes.map((type) => ({
            label: type.en_title,
            value: type.id.toString(),
          }));

          this.carBrandOptions = this.carBrands.map((brand) => ({
            label: brand.en_title,
            value: brand.id.toString(),
          }));

          this.carModelOptions = this.carModels.map((model) => ({
            label: model.en_title,
            value: model.id.toString(),
          }));

          this.initializeFields();
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load required data',
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }

  initializeFields() {
    // Define status steps to determine order
    const statusSteps = ['requested', 'pending', 'confirmed', 'canceled'];
    // Get the current status from editData if in edit mode
    const currentStatus =
      this.isEditMode && this.editData ? this.editData.active_status : null;
    const currentIndex = currentStatus
      ? statusSteps.indexOf(currentStatus)
      : -1;

    // Define status options and filter based on index and confirmed status
    const statusOptions = [
      { label: 'Requested', value: 'requested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Canceled', value: 'canceled' },
    ].filter((option) => {
      const optionIndex = statusSteps.indexOf(option.value);
      // Hide "canceled" if status is "confirmed"
      if (currentStatus === 'confirmed' && option.value === 'canceled') {
        return false;
      }
      // Only include options with equal or higher index than current status
      return (
        !this.isEditMode || currentIndex === -1 || optionIndex >= currentIndex
      );
    });

    this.formFields = [
      {
        name: 'admin_motor_insurance_number',
        label: 'Admin Motor Insurance Number',
        type: 'text',
        required: true,
        placeholder: 'Enter Admin Motor Insurance Number',
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
        name: 'motor_insurance_id',
        label: 'Motor Insurance',
        type: 'dropdown',
        required: true,
        options: this.motorInsuranceOptions,
        placeholder: 'Select Motor Insurance',
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
        name: 'motor_insurance_number',
        label: 'Motor Insurance Number',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter Motor Insurance Number',
      },
      {
        name: 'car_type',
        label: 'Car Type',
        type: 'text',
        required: true,
        placeholder: 'Select Car Type',
        disabled: true,
      },
      {
        name: 'car_brand',
        label: 'Car Brand',
        type: 'text',
        required: true,
        placeholder: 'Select Car Brand',
        disabled: true,
      },
      {
        name: 'car_model',
        label: 'Car Model',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Select Car Model',
      },
      {
        name: 'car_year',
        label: 'Car Year',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Select Car Year',
      },
      {
        name: 'car_price',
        label: 'Car Price',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter Car Price',
      },
    ];
  }
}
