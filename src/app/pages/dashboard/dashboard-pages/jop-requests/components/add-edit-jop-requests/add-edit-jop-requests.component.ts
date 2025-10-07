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
import { IJopInsurance } from '../../../../../../jop-insurance/res/interface/getAllJop';
import {
  FormField,
  GenericFormComponent,
} from '../../../../../../shared/components/generic-add/generic-add.component';
import { Category } from '../../../categories/services/categories.service';
import {
  JobRequest,
  JobRequestsService,
} from '../../services/jop-requests.service';

@Component({
  selector: 'app-add-edit-jop-requests',
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
  templateUrl: './add-edit-jop-requests.component.html',
  styleUrls: ['./add-edit-jop-requests.component.scss'],
  providers: [MessageService],
})
export class AddEditJopRequestsComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: JobRequest | null = null;
  jobRequestId: string | null = null;
  jobInsurances: IJopInsurance[] = [];
  jobInsuranceOptions: { label: string; value: string }[] = [];
  categories: Category[] = [];
  categoryOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private jobRequestsService: JobRequestsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.jobRequestId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.jobRequestId;

    this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data) {
          this.jobInsurances = data.data.jobInsurances?.data || [];
          this.categories = data.data.categories?.data || [];

          if (this.isEditMode && data.data.jobRequest) {
            this.editData = data.data.jobRequest.data;
            if (this.editData?.jop_insurance_id) {
              this.editData.jop_insurance_id = Number(
                this.editData.jop_insurance_id
              );
            }
            if (this.editData?.category_id) {
              this.editData.category_id = Number(this.editData.category_id);
            }
            if (this.editData) {
              this.extraFormData = {
                user_id: this.editData.user_id,
                jop_insurance_id: this.editData.jop_insurance_id,
                payment_method: this.editData.payment_method || 'Cash',
              };
            }
          }
          console.log('jobInsurances', this.jobInsurances);
          console.log('jobInsurances', this.editData);

          this.jobInsuranceOptions = this.jobInsurances.map((insurance) => ({
            label: `${insurance.company_name} - ${insurance.en_title}`,
            value: insurance.id.toString(),
          }));

          this.categoryOptions = this.categories.map((category) => ({
            label: category.en_title,
            value: category.id.toString(),
          }));

          this.initializeFields(data?.data?.jobRequest?.data?.request_type);
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

  initializeFields(type:any) {
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
    if(type ==="corporate" || type === "company-corporate"){
      this.formFields = [
        {
          name: 'admin_jop_insurance_number',
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
          showIf:{filed:"active_status",value:'confirmed'}
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
          name: 'category_id',
          label: 'Category',
          type: 'dropdown',
          required: true,
          options: this.categoryOptions,
          placeholder: 'Select Category',
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
          name: 'jop_title',
          label: 'Professional Title',
          type: 'text',
          required: true,
          placeholder: 'Professional Title',
          disabled: true,
        },
        {
          name: 'company_employee_total_money',
          label: 'Total Price',
          type: 'text',
          required: true,
          placeholder: 'Professional Price',
          disabled: true,
        },
      ];
    }else {
      this.formFields = [
        {
          name: 'admin_jop_insurance_number',
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
          showIf:{filed:"active_status",value:'confirmed'}
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
          name: 'category_id',
          label: 'Category',
          type: 'dropdown',
          required: true,
          options: this.categoryOptions,
          placeholder: 'Select Category',
          disabled: true,
        },
        // {
        //   name: 'jop_insurance_id',
        //   label: 'Job Insurance',
        //   type: 'dropdown',
        //   required: true,
        //   options: this.jobInsuranceOptions,
        //   placeholder: 'Select Job Insurance',
        //   disabled: true,
        // },
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
          name: 'jop_title',
          label: 'Professional Title',
          type: 'text',
          required: true,
          placeholder: 'Professional Title',
          disabled: true,
        },
        {
          name: 'jop_price',
          label: 'Professional Price',
          type: 'text',
          required: true,
          placeholder: 'Professional Price',
          disabled: true,
        },
        {
          name: 'jop_main_id',
          label: 'Professional Main Image',
          type: 'image',
          required: false,
          placeholder: 'Professional Main Image Link',
          disabled: true,
        },
        {
          name: 'jop_second_id',
          label: 'Professional Second Image',
          type: 'image',
          required: false,
          placeholder: 'Professional Second Image Link',
          disabled: true,
        },
      ];  
    }
  }
}
