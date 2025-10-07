import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  BuildingDataResponse,
  BuildingInsuranceService,
  BuildingPolicyData,
} from '../../../../../core/services/policies/building-policy.service';
import {
  UserService,
  UsersResponse,
} from '../../../../../core/services/users/users.service';
import { User } from '../../motors-requests/services/motors-requests.service';

export interface BuildingPolicyResolverData {
  users: UsersResponse;
  buildingData: BuildingDataResponse;
}

@Component({
  selector: 'app-create-building-policy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ToastModule,
    NgxSpinnerModule,
  ],
  templateUrl: './create-building-policy.component.html',
  providers: [MessageService],
})
export class CreateBuildingPolicyComponent implements OnInit {
  policyForm: FormGroup;
  isSubmitting = false;
  users: User[] = [];
  insurances: any[] = [];
  types: any[] = [];
  countries: any[] = [];
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
  private buildingInsuranceService = inject(BuildingInsuranceService);
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
      build_type: [null, Validators.required],
      country: [null, Validators.required],
      building_value: [
        null,
        [
          Validators.required,
          Validators.min(500000),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      building_insurance: [null, Validators.required],
      payment_method: ['Cash', Validators.required],
      admin_building_insurance_number: [null, Validators.required],
      active_status: ['requested', Validators.required],
      start_date: [null, Validators.required],
      duration: [null, Validators.required],
      end_date: [{ value: null, disabled: true }, Validators.required],
    });

    this.policyForm.get('build_type')?.valueChanges.subscribe((type) => {
      this.countries = type
        ? this.buildingInsuranceService.getCountriesByType(type.id)
        : [];
      this.policyForm.get('country')?.setValue(null);
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
        this.insurances = this.buildingInsuranceService.getActiveInsurances();
        this.types = this.buildingInsuranceService.getTypes();
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
  
  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove any non-numeric characters
    input.value = value.replace(/[^0-9]/g, '');
    // Update form control value
    this.policyForm
      .get('building_value')
      ?.setValue(input.value, { emitEvent: false });
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

  onSubmit() {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.ngxSpinnerService.show('policyLoader');

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const policyData: BuildingPolicyData = {
      category_id: '3',
      user_id: this.policyForm.get('user')?.value.id,
      building_insurance_id:
        this.policyForm.get('building_insurance')?.value.id,
      name: this.policyForm.get('name')?.value,
      email: this.policyForm.get('email')?.value,
      phone: this.policyForm.get('phone')?.value,
      build_type_id: this.policyForm.get('build_type')?.value.id,
      country_id: this.policyForm.get('country')?.value.id,
      building_country: this.policyForm.get('country')?.value.en_title,
      building_price: this.policyForm.get('building_value')?.value.toString(),
      payment_method: this.policyForm.get('payment_method')?.value,
      active_status: this.policyForm.get('active_status')?.value,
      start_date: formatDate(this.policyForm.get('start_date')?.value),
      duration: String(this.policyForm.get('duration')?.value),
      end_date: formatDate(this.policyForm.get('end_date')?.value),
      building_type: this.policyForm.get('build_type')?.value.en_title,
      admin_building_insurance_number: this.policyForm.get(
        'admin_building_insurance_number'
      )?.value,
    };

    this.buildingInsuranceService.submitBuildingPolicy(policyData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Building Policy created successfully',
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
        this.router.navigate(['/dashboard/menu/building-requests']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create building policy',
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
      },
    });
  }
}
