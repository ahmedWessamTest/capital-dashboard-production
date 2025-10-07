import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { FormField, GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { CarModel } from '../../../car-model/services/car-model.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-car-years',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule,
    ToastModule,
    GenericFormComponent
  ],
  templateUrl: './add-edit-car-years.component.html',
  styleUrls: ['./add-edit-car-years.component.scss'],
  providers: [MessageService]
})
export class AddEditCarYearsComponent implements OnInit, OnDestroy {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;
  carYearId: string | null = null;
  carModels: CarModel[] = [];
  carModelOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};
  private dataSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carYearId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.carYearId;

    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        console.log(data)
        if (data?.data) {
          // Handle different response structures
          if (this.isEditMode && data.data.carYear) {
            // Edit mode response (CarYearWithModels)
            this.editData = data.data.carYear;
            this.carModels = data.data.carModels || [];
          } else if (!this.isEditMode && data.data.combinedData) {
            // Add mode response (FullCarDataResponse)
            this.carModels = data.data.carModels || [];
          }

          // Prepare car model options for dropdown
          this.carModelOptions = this.carModels.map(model => ({
            label: model.en_title || 'Unnamed Model',
            value: model.id.toString()
          }));

          // Initialize form fields
          this.initializeFields();

          // Hide spinner after data is processed
          this.ngxSpinnerService.hide('actionsLoader');
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No data received from resolver'
          });
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load required data'
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.ngxSpinnerService.hide('actionsLoader');
  }

  initializeFields() {
    this.formFields = [
      {
        name: 'car_model_id',
        label: 'Car Model',
        type: 'dropdown',
        required: true,
        options: this.carModelOptions,
        placeholder: this.carModelOptions.length ? 'Select Car Model' : 'No Models Available'
      },
      {
        name: 'year_date',
        label: 'Year',
        type: 'text',
        required: true,
        placeholder: 'Enter year (e.g. 2023)',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true
      }
    ];
  }
}