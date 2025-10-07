import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import {
  FormField,
  GenericFormComponent,
} from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-jop-insurance',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputSwitchModule,
    ButtonModule,
    ToastModule,
    GenericFormComponent,
  ],
  templateUrl: './add-edit-jop-insurance.component.html',
  styleUrls: ['./add-edit-jop-insurance.component.scss'],
})
export class AddEditJopInsuranceComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.initializeFields();
    this.checkEditMode();
  }

  initializeFields() {
    this.formFields = [
      {
        name: 'en_title',
        label: 'English Title',
        type: 'text',
        required: true,
        placeholder: 'English Title',
      },
      {
        name: 'ar_title',
        label: 'Arabic Title',
        type: 'text',
        required: true,
        placeholder: 'Arabic Title',
      },
      {
        name: 'year_money',
        label: 'Yearly Money',
        type: 'number',
        required: true,
        validators: [this.validationService.positiveNumberValidator()],
        placeholder: 'Yearly Money',
      },
      {
        name: 'month_money',
        label: 'Monthly Money',
        type: 'number',
        required: true,
        validators: [this.validationService.positiveNumberValidator()],
        placeholder: 'Monthly Money',
      },
      {
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Company Name',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true,
      },
    ];
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
    }
    this.route.data.subscribe({
      next: ({ data }) => {
        this.editData = data.data.data;
      },
      error: (err) => {
        console.error('Failed to load job insurances', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
