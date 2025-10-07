import { Component } from '@angular/core';
import { FormErrorDirective } from '../../../../../../core/directives/form-error.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ValidationService } from '../../../../../../core/services/validation/form-validators.service';
import { MedicalInsurancesService } from '../../services/medical-insurances.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../../../../core/services/messages/messages.service';
import { ToastModule } from 'primeng/toast';
import { FormField, GenericFormComponent } from "../../../../../../shared/components/generic-add/generic-add.component";
@Component({
  selector: 'app-add-edit-medical-insurances',
  standalone: true,
  imports: [FormErrorDirective, ReactiveFormsModule, CommonModule, InputSwitchModule, ButtonModule, ToastModule, GenericFormComponent],
  templateUrl: './add-edit-medical-insurances.component.html',
  styleUrl: './add-edit-medical-insurances.component.scss',
})
export class AddEditMedicalInsurancesComponent {

  formFields: FormField[] = [];
  isEditMode = false;
  editData: any = null;
  data: any = null;

  constructor(
    private route: ActivatedRoute,
    private validationService: ValidationService
    ,
    private ngxSpinnerService :NgxSpinnerService,
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
        name: 'year_money',
        label: 'Yearly Money',
        type: 'number',
        required: true,
        validators: [this.validationService.positiveNumberValidator()],
        placeholder: 'Yearly Money'
      },
      
      {
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Company Name'
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true
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
        console.log(data)
        console.log("from medical insurance data",data)
        this.editData = data.data;
        console.log(this.editData);
        
      },
      error: (err) => {
        console.error('Failed to load medicalInsurances', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      complete: () => {
      }
    });
    this.ngxSpinnerService.hide('actionsLoader');
  }

  
}