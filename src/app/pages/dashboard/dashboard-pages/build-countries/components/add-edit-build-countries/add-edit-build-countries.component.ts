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
import { BuildCountriesService, BuildCountry } from '../../services/build-countries.service';
import { BuildType } from '../../../build-types/services/build-types.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-build-countries',
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
  templateUrl: './add-edit-build-countries.component.html',
  styleUrls: ['./add-edit-build-countries.component.scss'],
  providers: [MessageService]
})
export class AddEditBuildCountriesComponent implements OnInit, OnDestroy {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: BuildCountry | null = null;
  buildCountryId: string | null = null;
  buildTypes: BuildType[] = [];
  buildTypeOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};
  private dataSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService,
    private buildCountriesService: BuildCountriesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.buildCountryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.buildCountryId;

    this.dataSubscription = this.route.data.subscribe({
      next: (data: any) => {
        if (data?.data) {
          // Extract buildTypes from resolver data
          this.buildTypes = data.data.buildTypes?.map((type: any) => type.data || type) || [];

          // Handle edit mode
          if (this.isEditMode && data.data.buildCountry) {
            this.editData = data.data.buildCountry.data;
            if (this.editData?.build_type_id) {
              this.editData.build_type_id = Number(this.editData.build_type_id);
            }
          }

          // Populate buildTypeOptions for dropdown
          this.buildTypeOptions = this.buildTypes.map(type => ({
            label: type.en_title || 'Unnamed Build Type',
            value: type.id.toString()
          }));

          // Initialize form fields
          this.initializeFields();

          // Hide spinner after data is processed
          this.ngxSpinnerService.hide('actionsLoader');
        } else {
          // Handle case where no data is returned
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
    // Unsubscribe from route.data subscription
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    // Ensure spinner is hidden on component destruction
    this.ngxSpinnerService.hide('actionsLoader');
  }

  initializeFields() {
    this.formFields = [
      {
        name: 'build_type_id',
        label: 'Build Type',
        type: 'dropdown',
        required: true,
        options: this.buildTypeOptions,
        placeholder: this.buildTypeOptions.length ? 'Select Build Type' : 'No Build Types Available'
      },
      {
        name: 'en_title',
        label: 'English Title',
        type: 'text',
        required: true,
        placeholder: 'English Title'
      },
      {
        name: 'ar_title',
        label: 'Arabic Title',
        type: 'text',
        required: true,
        placeholder: 'Arabic Title'
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