import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  MotorDataResponse,
  MotorInsuranceService,
  MotorPolicyData,
} from '../../../../../core/services/policies/motors-policy.service';
import {
  UserService,
  UsersResponse,
} from '../../../../../core/services/users/users.service';
import { User } from '../../motors-requests/services/motors-requests.service';

export interface MotorPolicyResolverData {
  users: UsersResponse;
  motorData: MotorDataResponse;
}

@Component({
  selector: 'app-create-motor-policy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    NgxSpinnerModule,
  ],
  templateUrl: './create-motor-policy.component.html',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CreateMotorPolicyComponent implements OnInit {
  policyForm: FormGroup;
  isSubmitting = false;
  users: User[] = [];
  insurances: any[] = [];
  types: any[] = [];
  brands: any[] = [];
  models: any[] = [];
  years: any[] = [];
  paymentMethods = [{ label: 'Cash', value: 'cash' }];
  activeStatuses = [
    { label: 'Requested', value: 'requested' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Canceled', value: 'canceled' },
  ];
  durations = [
    { label: '1 Year', value: 1 },
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
  ];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private motorInsuranceService = inject(MotorInsuranceService);
  private userService = inject(UserService);

  constructor() {
    this.policyForm = this.fb.group({
      user: [null, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phone: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^[0-9]{10,}$')],
      ],
      car_type: [null, Validators.required],
      car_brand: [null, Validators.required],
      car_model: [null, Validators.required],
      car_year: [null, Validators.required],
      car_price: [
        null,
        [
          Validators.required,
          Validators.min(500000),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      motor_insurance: [null, Validators.required],
      admin_motor_insurance_number: [null, Validators.required],
      payment_method: ['cash', Validators.required],
      active_status: ['requested', Validators.required],
      start_date: [null, Validators.required],
      duration: [null, Validators.required],
      end_date: [{ value: null, disabled: true }, Validators.required],
    });

    this.policyForm.get('car_brand')?.valueChanges.subscribe((brand) => {
      this.models = brand
        ? this.motorInsuranceService.getModelsByBrand(brand.id)
        : [];
      this.policyForm.get('car_model')?.setValue(null);
    });

    this.policyForm
      .get('start_date')
      ?.valueChanges.subscribe(() => this.updateEndDate());
    this.policyForm
      .get('duration')
      ?.valueChanges.subscribe(() => this.updateEndDate());
  }

  ngOnInit() {
    this.route.data.subscribe({
      next: (data) => {
        this.users = data['data'].users.data.filter(
          (user: any) => user.delete_status === 0
        );
        this.insurances = this.motorInsuranceService.getActiveInsurances();
        this.types = this.motorInsuranceService.getTypes();
        this.brands = this.motorInsuranceService.getBrands();
        this.years = this.motorInsuranceService
          .getYears()
          .map((year) => ({ label: year.toString(), value: year }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data',
        });
      },
    });

    this.policyForm.get('user')?.valueChanges.subscribe((user) => {
      if (user) {
        this.policyForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }
    });

    this.ngxSpinnerService.hide('actionsLoader');
  }

  updateEndDate() {
    const startDate = this.policyForm.get('start_date')?.value;
    const duration = this.policyForm.get('duration')?.value;
    if (startDate && duration) {
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + duration);
      this.policyForm.get('end_date')?.setValue(endDate);
    }
  }

  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove any non-numeric characters
    input.value = value.replace(/[^0-9]/g, '');
    // Update form control value
    this.policyForm
      .get('car_price')
      ?.setValue(input.value, { emitEvent: false });
  }

  onSubmit() {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.ngxSpinnerService.show('policyLoader');

    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const policyData: MotorPolicyData = {
      category_id: '2',
      user_id: this.policyForm.get('user')?.value.id,
      motor_insurance_id: this.policyForm.get('motor_insurance')?.value.id,
      name: this.policyForm.get('name')?.value,
      email: this.policyForm.get('email')?.value,

      phone: this.policyForm.get('phone')?.value,
      car_type_id: this.policyForm.get('car_type')?.value.id,
      car_type: this.policyForm.get('car_type')?.value.en_title,
      car_brand_id: this.policyForm.get('car_brand')?.value.id,
      car_brand: this.policyForm.get('car_brand')?.value.en_title,
      car_model_id: this.policyForm.get('car_model')?.value.id,
      car_model: this.policyForm.get('car_model')?.value.en_title,
      admin_motor_insurance_number: this.policyForm.get(
        'admin_motor_insurance_number'
      )?.value,
      car_year: this.policyForm.get('car_year')?.value.toString(),
      car_price: this.policyForm.get('car_price')?.value,
      payment_method: this.policyForm.get('payment_method')?.value,
      active_status: this.policyForm.get('active_status')?.value,
      start_date: formatDate(this.policyForm.get('start_date')?.value),
      duration: String(this.policyForm.get('duration')?.value),
      end_date: formatDate(this.policyForm.get('end_date')?.value),
    };

    this.motorInsuranceService.submitMotorPolicy(policyData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Motor Policy created successfully',
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
        this.router.navigate(['/dashboard/menu/motor-requests']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create motor policy',
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
      },
    });
  }
}
