import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarType } from '../../../car-types/services/car-types.service';
import { CarBrand } from '../../../car-brands/services/car-brands.service';
import { Subscription } from 'rxjs';
import { CarModelsService } from '../../../car-model/services/car-model.service';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';

@Component({
  selector: 'app-add-edit-car-models',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule
  ],
  templateUrl: './add-edit-car-model.component.html',
  styleUrls: ['./add-edit-car-model.component.scss']
})
export class AddEditCarModelsComponent implements OnInit, OnDestroy {
  carModelForm: FormGroup;
  carBrands: CarBrand[] = [];
  private dataSubscription: Subscription | null = null;
  loading: boolean = false;
  message = { text: '', type: '' };
  isEditMode = false;
  carModelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private carModelsService: CarModelsService,
    private validationService: ValidationService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {
    this.carModelForm = this.fb.group({
      car_brand_id: ['', Validators.required],
      en_title: ['', Validators.required],
      ar_title: ['', Validators.required],
      active_status: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.carModelId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.carModelId;

    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        this.carBrands = data.data.carBrands || [];
        console.log(data);

        if (!this.carBrands.length) {
          console.warn('No car brands received from resolver');
          this.message = { text: 'No car brands available', type: 'warn' };
          this.clearMessage();
        }

        if (this.isEditMode && data.data.carModel) {
          this.carModelForm.patchValue({
            car_brand_id: data.data.carModel.car_brand_id,
            en_title: data.data.carModel.en_title,
            ar_title: data.data.carModel.ar_title,
            active_status: this.normalizeActiveStatusService.normalizeActiveStatus(data.data.carModel.active_status)
          });
        }

        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.message = { text: 'Failed to load required data', type: 'error' };
        this.clearMessage();
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });

    this.ngxSpinnerService.hide('actionsLoader');
  }

  onSubmit() {
    if (this.carModelForm.invalid) {
      this.markFormGroupTouched(this.carModelForm);
      return;
    }

    this.loading = true;
    this.message = { text: '', type: '' };
    this.ngxSpinnerService.show('actionsLoader');

    const formValues = this.carModelForm.value;
    const formData = new FormData();
    formData.append('car_brand_id', formValues.car_brand_id);
    formData.append('en_title', formValues.en_title);
    formData.append('ar_title', formValues.ar_title);
    formData.append('active_status', formValues.active_status ? '1' : '0');

    const request = this.isEditMode && this.carModelId
      ? this.carModelsService.update(+this.carModelId, formData)
      : this.carModelsService.create(formData);

    request.subscribe({
      next: () => {
        this.message = { text: `Car model ${this.isEditMode ? 'updated' : 'created'} successfully`, type: 'success' };
        this.router.navigate(['/dashboard/menu/car-models']);
        this.ngxSpinnerService.hide('actionsLoader');
        this.loading = false;
        this.clearMessage();
      },
      error: (err) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} car model:`, err);
        this.message = { text: `Failed to ${this.isEditMode ? 'update' : 'create'} car model`, type: 'error' };
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