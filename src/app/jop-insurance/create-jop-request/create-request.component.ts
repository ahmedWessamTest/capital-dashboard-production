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
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  JopInsuranceService,
  JopPolicyData,
} from '../../core/services/policies/jop-policy.service';
import { UserService } from '../../core/services/users/users.service';
import { User } from '../../pages/dashboard/dashboard-pages/motors-requests/services/motors-requests.service';
import { IJopInsurance } from '../res/interface/getAllJop';

@Component({
  selector: 'app-create-jop-policy',
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
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss',
})
export class CreateJopPolicy implements OnInit {
  policyForm: FormGroup;
  isSubmitting = false;
  users: User[] = [];
  insurances: IJopInsurance[] = [];
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

  // Job titles dropdown options
  jobTitles = [
    {
      label: 'Lawyers and legal consultants',
      value: 'lawyers_legal_consultants',
    },
    { label: 'Accountants and auditors', value: 'accountants_auditors' },
    {
      label: 'Insurance brokers and agents',
      value: 'insurance_brokers_agents',
    },
    {
      label: 'Doctors, dentists, and other medical professionals',
      value: 'medical_professionals',
    },
    { label: 'Engineers and architects', value: 'engineers_architects' },
    {
      label: 'IT consultants and software developers',
      value: 'it_consultants_developers',
    },
    {
      label: 'Management and business consultants',
      value: 'management_business_consultants',
    },
    { label: 'Surveyors and valuers', value: 'surveyors_valuers' },
    {
      label:
        'Media, marketing, and creative agencies providing professional services',
      value: 'media_marketing_creative',
    },
    { label: 'Others', value: 'others' },
  ];

  showCustomJobTitle = false;
  selectedMainImage: File | null = null;
  selectedSecondImage: File | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private jopInsuranceService = inject(JopInsuranceService);
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
      jop_insurance: [null, Validators.required],
      jop_title: [null, Validators.required],
      custom_jop_title: [''],
      jop_price: [
        '',
        [
          Validators.required,
          Validators.min(50000),
          Validators.max(1000000),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      jop_main_id: [null, Validators.required],
      jop_second_id: [null],
      active_status: ['requested', Validators.required],
      start_date: [null, Validators.required],
            duration: [null, Validators.required],
            end_date: [{ value: null, disabled: true }, Validators.required],
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
        this.insurances = data['data'].jopData.category.jopinsurances.filter(
          (insurance: any) => insurance.active_status === 1
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

    // Watch job title changes to show/hide custom input
    this.policyForm
      .get('jop_title')
      ?.valueChanges.subscribe((selectedTitle) => {
        this.showCustomJobTitle = selectedTitle?.value === 'others';
        if (this.showCustomJobTitle) {
          this.policyForm
            .get('custom_jop_title')
            ?.setValidators([Validators.required]);
        } else {
          this.policyForm.get('custom_jop_title')?.clearValidators();
          this.policyForm.get('custom_jop_title')?.setValue('');
        }
        this.policyForm.get('custom_jop_title')?.updateValueAndValidity();
      });
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
  onMainImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedMainImage = file;
      this.policyForm.patchValue({
        jop_main_id: file,
      });
      this.policyForm.get('jop_main_id')?.markAsTouched();
    }
  }

  onSecondImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedSecondImage = file;
      this.policyForm.patchValue({
        jop_second_id: file,
      });
      this.policyForm.get('jop_second_id')?.markAsTouched();
    }
  }

  removeMainImage() {
    this.selectedMainImage = null;
    this.policyForm.patchValue({
      jop_main_id: null,
    });
    this.policyForm.get('jop_main_id')?.markAsTouched();
  }

  removeSecondImage() {
    this.selectedSecondImage = null;
    this.policyForm.patchValue({
      jop_second_id: null,
    });
    this.policyForm.get('jop_second_id')?.markAsTouched();
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
    const policyData: JopPolicyData = {
      category_id: '5',
      jop_insurance_id: String(this.policyForm.get('jop_insurance')?.value.id),
      user_id: String(this.policyForm.get('user')?.value.id),
      name: this.policyForm.get('name')?.value,
      email: this.policyForm.get('email')?.value,
      phone: this.policyForm.get('phone')?.value,
      jop_title: this.showCustomJobTitle
        ? this.policyForm.get('custom_jop_title')?.value
        : this.policyForm.get('jop_title')?.value.label,
      jop_price: this.policyForm.get('jop_price')?.value,
      jop_main_id: this.policyForm.get('jop_main_id')?.value,
      jop_second_id: this.policyForm.get('jop_second_id')?.value,
      active_status: this.policyForm.get('active_status')?.value,
      start_date: formatDate(this.policyForm.get('start_date')?.value),
      duration: String(this.policyForm.get('duration')?.value),
      end_date: formatDate(this.policyForm.get('end_date')?.value),
    };
console.log(policyData);

    this.jopInsuranceService.submitJopPolicy(policyData).subscribe({
      next: () => {
        this.message = {
          text: 'professional Policy created successfully',
          type: 'success',
        };
        this.clearMessageAfterDelay();
        this.isSubmitting = false;
        this.ngxSpinnerService.hide('policyLoader');
        this.router.navigate(['/dashboard/menu/jop-requests']);
      },
      error: () => {
        this.message = {
          text: 'Failed to create job policy',
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
}
