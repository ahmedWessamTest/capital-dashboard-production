import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormField, GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { MedicalClaimsService } from '../../../../../../core/services/claims/medical-claim.service';
import { MedicalClaim } from '../../../../../../core/services/users/users.service';
import { Category } from '../../../categories/services/categories.service';

@Component({
  selector: 'app-add-edit-medical-claims',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    GenericFormComponent
  ],
  templateUrl: './add-edit-medical-claims.component.html',
  styleUrls: ['./add-edit-medical-claims.component.scss'],
  providers: [MessageService]
})
export class AddEditMedicalClaimsComponent implements OnInit {
  formFields: FormField[] = [];
  isEditMode = false;
  editData: MedicalClaim | null = null;
  medicalClaimId: string | null = null;
  medicalInsuranceOptions: { label: string; value: string }[] = [];
  categories: Category[] = [];
  categoryOptions: { label: string; value: string }[] = [];
  extraFormData: { [key: string]: string | number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalClaimsService: MedicalClaimsService,
    private messageService: MessageService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.medicalClaimId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.medicalClaimId;

    this.route.data.subscribe({
      next: (data: any) => {
        if (data) {
          this.categories = data.data?.category?.data || [];
          if (this.isEditMode && data.data?.medicalClaim) {
            this.editData = data.data.medicalClaim.data;
            if (this.editData?.medical_insurance_id) {
              this.editData.medical_insurance_id = Number(this.editData.medical_insurance_id);
            }
            if (this.editData) {
              this.extraFormData = {
                user_id: this.editData.user_id,
                medical_insurance_id: Number(this.editData.medical_insurance_id),
                category_id: this.editData.category_id
              };
            }
          }

         

          this.categoryOptions = this.categories.map(category => ({
            label: category.en_title,
            value: category.id.toString()
          }));

          this.initializeFields();
          this.ngxSpinnerService.hide('actionsLoader');
        }
      },
      error: (err) => {
        console.error('Failed to load data', err);
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

  initializeFields() {
    this.formFields = [
     
    
      {
        name: 'claim_date',
        label: 'Claim Date',
        type: 'date',
        required: true,
        placeholder: 'Select Claim Date'
      },
      
      {
        name: 'status',
        label: 'Status',
        type: 'dropdown',
        required: true,
        options: [
          { label: 'Requested', value: 'requested' },
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' }
        ],
        placeholder: 'Select Status'
      }
    ];
  }
}