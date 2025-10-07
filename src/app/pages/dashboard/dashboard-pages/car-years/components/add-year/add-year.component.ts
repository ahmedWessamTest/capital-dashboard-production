import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarModel } from '../../../car-model/services/car-model.service';
import { Subscription } from 'rxjs';
import { CarYear, CarYearsService } from '../../services/car-years.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';

// Custom validator for year range
function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Don't validate empty control, required validator handles this
    }

    const year = parseInt(control.value, 10);
    const currentYear = new Date().getFullYear();

    // Example range: 1900 to current year + 1 (allowing for next model year)
    const minYear = 1900;

    if (isNaN(year) || year < minYear || year > currentYear + 1) {
      return { 'yearRange': { value: control.value } };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-car-years',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule
  ],
  templateUrl: './add-year.component.html',
  styleUrls: ['./add-year.component.scss']
})
export class AddYearComponent implements OnInit, OnDestroy {
  carYearForm: FormGroup;
  carModels: CarModel[] = [];
  private dataSubscription: Subscription | null = null;
  loading: boolean = false;
  message = { text: '', type: '' };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private carYearsService: CarYearsService,
    private validationService: ValidationService,
  
  ) {
    this.carYearForm = this.fb.group({
      car_model_id: ['', Validators.required],
      year_date: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
        yearRangeValidator()
      ]],
      active_status: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data?.carModels) {
          this.carModels = data.data.carModels || [];
          this.ngxSpinnerService.hide('actionsLoader');
        } else {
          this.message = { text: 'No car models data received from resolver', type: 'error' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load car models data:', err);
        this.message = { text: 'Failed to load required car models data', type: 'error' };
        this.clearMessage();
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  onSubmit() {
    if (this.carYearForm.invalid) {
      this.markFormGroupTouched(this.carYearForm);
      return;
    }

    this.loading = true;
    this.message = { text: '', type: '' };

    const formValues = this.carYearForm.value;
    const selectedCarModelId = formValues.car_model_id;
    const enteredYear = formValues.year_date;

    this.carYearsService.getAll().subscribe({
      next: (res) => {
        const yearsForSelectedModel = res.data
          .filter((item: CarYear) => item.car_model_id === selectedCarModelId)
          .map((item: CarYear) => item.year_date);

        if (yearsForSelectedModel.includes(enteredYear)) {
          this.message = { text: `The year ${enteredYear} already exists for the selected car model.`, type: 'warn' };
          this.clearMessage();
          this.ngxSpinnerService.hide('actionsLoader');
          this.loading = false;
          return;
        }

        this.ngxSpinnerService.show('actionsLoader');

        const formData = new FormData();
        formData.append('car_model_id', selectedCarModelId);
        formData.append('year_date[]', enteredYear);
        formData.append('active_status', formValues.active_status ? '1' : '0');


        this.carYearsService.create(formData).subscribe({
          next: () => {
            this.message = { text: 'Car year created successfully', type: 'success' };
            this.router.navigate(['/dashboard/menu/car-years']);
            this.ngxSpinnerService.hide('actionsLoader');
            this.loading = false;
            this.clearMessage();
          },
          error: (err) => {
            console.error('Error creating car year:', err);
            this.message = { text: 'Failed to create car year', type: 'error' };
            this.clearMessage();
            this.ngxSpinnerService.hide('actionsLoader');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching existing car years:', err);
        this.message = { text: 'Failed to check for existing car years.', type: 'error' };
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

  numericOnly(event: KeyboardEvent): boolean {
    return this.validationService.numericOnly(event);
  }

  preventInvalidPaste(event: ClipboardEvent): void {
    this.validationService.preventInvalidPaste(event);
  }
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.ngxSpinnerService.hide('actionsLoader');
  }
}