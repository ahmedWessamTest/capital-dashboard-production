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
import { CarType } from '../../../car-types/services/car-types.service';
import { CarBrandsService, CarBrand } from '../../../car-brands/services/car-brands.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';

@Component({
  selector: 'app-add-car-brand',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule
  ],
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddCarBrandComponent implements OnInit, OnDestroy {
  carBrandForm: FormGroup;
  carTypes: CarType[] = [];
  private dataSubscription: Subscription | null = null;
  loading: boolean = false;
  message = { text: '', type: '' };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private carBrandsService: CarBrandsService,
    private validationService: ValidationService
  ) {
    this.carBrandForm = this.fb.group({
      en_title: ['', [Validators.required, Validators.minLength(2)]],
      ar_title: ['', [Validators.required, Validators.minLength(2)]],
      active_status: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data?.carTypes) {
          this.carTypes = data.data.carTypes || [];
          this.ngxSpinnerService.hide('actionsLoader');
        } else {
          this.message = { text: 'No car types data received from resolver', type: 'error' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load car types data:', err);
        this.message = { text: 'Failed to load required car types data', type: 'error' };
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

    this.loading = true;
    this.message = { text: '', type: '' };
    this.ngxSpinnerService.show('actionsLoader');

    const formValues = this.carBrandForm.value;
    const formData = new FormData();
    formData.append('en_title', formValues.en_title);
    formData.append('ar_title', formValues.ar_title);
    formData.append('active_status', formValues.active_status ? '1' : '0');

    this.carBrandsService.getAll().subscribe({
      next: (res) => {
        const existingBrands = res.data.map((item: CarBrand) => item.en_title.toLowerCase());

        if (existingBrands.includes(formValues.en_title.toLowerCase())) {
          this.message = { text: `The brand ${formValues.en_title} already exists.`, type: 'warn' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
          this.loading = false;
          return;
        }

        this.carBrandsService.create(formData).subscribe({
          next: () => {
            this.message = { text: 'Car brand created successfully', type: 'success' };
            this.router.navigate(['/dashboard/menu/car-brands']);
            this.ngxSpinnerService.hide('actionsLoader');
            this.loading = false;
            this.clearMessage();
          },
          error: (err) => {
            console.error('Error creating car brand:', err);
            this.message = { text: 'Failed to create car brand', type: 'error' };
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