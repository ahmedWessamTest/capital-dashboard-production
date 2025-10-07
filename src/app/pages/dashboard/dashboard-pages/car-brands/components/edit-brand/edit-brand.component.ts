import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CarBrand, CarBrandsService } from '../../../car-brands/services/car-brands.service';
import { CarType } from '../../../car-types/services/car-types.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-edit-car-brand',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule
  ],
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditCarBrandComponent implements OnInit, OnDestroy {
  carBrandForm: FormGroup;
  carTypes: CarType[] = [];
  private dataSubscription: Subscription | null = null;
  loading: boolean = false;
  message = { text: '', type: '' };
  carBrandId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private carBrandsService: CarBrandsService,
    private validationService: ValidationService,
    private normalizeActiveStatus: NormalizeActiveStatusService
  ) {
    this.carBrandForm = this.fb.group({
      // car_type_id: ['', Validators.required],
      en_title: ['', [Validators.required, Validators.minLength(2)]],
      ar_title: ['', [Validators.required, Validators.minLength(2)]],
      active_status: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data?.carBrand && data?.data?.carTypes) {
          this.carTypes = data.data.carTypes || [];
          this.carBrandId = data.data.carBrand.id;
          this.carBrandForm.patchValue({
            // car_type_id: data.data.carBrand.car_type_id,
            en_title: data.data.carBrand.en_title,
            ar_title: data.data.carBrand.ar_title,
            active_status: data.data.carBrand.active_status // Already normalized to boolean by resolver
          });
          this.ngxSpinnerService.hide('actionsLoader');
        } else {
          this.message = { text: 'Failed to load car brand or types data', type: 'error' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load car brand data:', err);
        this.message = { text: 'Failed to load required data', type: 'error' };
        this.clearMessage();
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  onSubmit() {
    if (this.carBrandForm.invalid) {
      this.markFormGroupTouched(this.carBrandForm);
      return;
    }

    if (!this.carBrandId) {
      this.message = { text: 'No car brand ID provided', type: 'error' };
      this.clearMessage();
      return;
    }

    this.loading = true;
    this.message = { text: '', type: '' };
    this.ngxSpinnerService.show('actionsLoader');

    const formValues = this.carBrandForm.value;
    const formData = new FormData();
    // formData.append('car_type_id', formValues.car_type_id);
    formData.append('en_title', formValues.en_title);
    formData.append('ar_title', formValues.ar_title);
    formData.append('active_status', formValues.active_status ? '1' : '0');

    this.carBrandsService.getAll().subscribe({
      next: (res) => {
        const existingBrands = res.data
          .filter((item: CarBrand) => item.id !== this.carBrandId)
          .map((item: CarBrand) => item.en_title.toLowerCase());

        if (existingBrands.includes(formValues.en_title.toLowerCase())) {
          this.message = { text: `The brand ${formValues.en_title} already exists.`, type: 'warn' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
          this.loading = false;
          return;
        }

        this.carBrandsService.update(this.carBrandId!, formData).subscribe({
          next: () => {
            this.message = { text: 'Car brand updated successfully', type: 'success' };
            this.router.navigate(['/dashboard/menu/car-brands']);
            this.ngxSpinnerService.hide('actionsLoader');
            this.loading = false;
            this.clearMessage();
          },
          error: (err) => {
            console.error('Error updating car brand:', err);
            this.message = { text: 'Failed to update car brand', type: 'error' };
            this.clearMessage();
            this.ngxSpinnerService.hide('actionsLoader');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching existing car brands:', err);
        this.message = { text: 'Failed to check for existing car brands.', type: 'error' };
        this.clearMessage();
        this.ngxSpinnerService.hide('actionsLoader');
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private clearMessage() {
    setTimeout(() => {
      this.message = { text: '', type: '' };
    }, 5000);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.ngxSpinnerService.hide('actionsLoader');
  }
}