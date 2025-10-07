import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  MedicalInsuranceService,
  MedicalPolicyData,
} from '../../../../../core/services/policies/medical-policy.service';
import { UserService } from '../../../../../core/services/users/users.service';
import { MedicalInsurance } from '../../medical-requests/services/medical-requests.service';
import { User } from '../../motors-requests/services/motors-requests.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-medical-policy',
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
  templateUrl: './create-medical-policy.component.html',
  providers: [],
})
export class CreateMedicalPolicyComponent implements OnInit,OnDestroy {
  private readonly destroy$ = new Subject<void>();
  policyForm: FormGroup;
  isSubmitting = false;
  users: User[] = [];
  insurances: MedicalInsurance[] = [];
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
  message: { text: string; type: 'success' | 'error' } | null = null;
  today = new Date();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private medicalInsuranceService = inject(MedicalInsuranceService);
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
      gender: [null, Validators.required],
      birthdate: [null, Validators.required],
      medical_insurance: [null, Validators.required],
      admin_medical_insurance_number: [null, Validators.required],
      payment_method: ['cash', Validators.required],
      active_status: ['requested', Validators.required],
      start_date: [null, Validators.required],
      duration: [null, Validators.required],
      end_date: [{ value: null, disabled: true }, Validators.required],
    });

    this.policyForm
      .get('start_date')
      ?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateEndDate());
    this.policyForm
      .get('duration')
      ?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateEndDate());
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.users = data['data'].users.data.filter(
          (user: any) => user.delete_status === 0
        );
        this.insurances = data[
          'data'
        ].medicalData.category.medicalinsurances.filter(
          (insurance: any) => insurance.active_status === '1'
        );
      },
      error: () => {
        this.message = {
          text: 'Failed to load data',
          type: 'error',
        };
        this.clearMessageAfterDelay();
      },
    });

    this.policyForm.get('user')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.policyForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender || null,
          birthdate: user.birth_date ? new Date(user.birth_date) : null,
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

    const policyData: MedicalPolicyData = {
      category_id: '1',
      user_id: this.policyForm.get('user')?.value.id,
      medical_insurance_id: this.policyForm.get('medical_insurance')?.value.id,
      name: this.policyForm.get('name')?.value,
      email: this.policyForm.get('email')?.value,
      phone: this.policyForm.get('phone')?.value,
      gender: this.policyForm.get('gender')?.value,
      birthdate: formatDate(this.policyForm.get('birthdate')?.value),
      payment_method: String(this.policyForm.get('payment_method')?.value),
      active_status: this.policyForm.get('active_status')?.value,
      start_date: formatDate(this.policyForm.get('start_date')?.value),
      duration: String(this.policyForm.get('duration')?.value),
      end_date: formatDate(this.policyForm.get('end_date')?.value),
      admin_medical_insurance_number: this.policyForm.get(
        'admin_medical_insurance_number'
      )?.value,
    };

    this.medicalInsuranceService.submitMedicalPolicy(policyData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.message = {
          text: 'Medical Policy created successfully',
          type: 'success',
        };
        this.clearMessageAfterDelay();
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
        this.router.navigate(['/dashboard/menu/medical-requests']);
      },
      error: () => {
        this.message = {
          text: 'Failed to create medical policy',
          type: 'error',
        };
        this.clearMessageAfterDelay();
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
      },
    });
  }

  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete()
  }
}
