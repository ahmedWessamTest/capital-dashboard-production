import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../core/services/users/users.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    ToastModule,
    DropdownModule,
    CommonModule,
    NgxSpinnerModule
  ],
  templateUrl: './add-employee.component.html',
  styles: "",
  providers: [MessageService],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  isSubmitting = false;
  roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Employee', value: 'employee' }
  ];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      en_job: ['',],
      ar_job: ['',],
      phone: ['', [Validators.pattern('^\\d{11}$')]],
      en_text: [''],
      ar_text: [''],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.ngxSpinnerService.show("actionsLoader");

    const formData = this.employeeForm.value;
    
    this.userService.create(formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee added successfully'
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide("actionsLoader");
        this.router.navigate(['/dashboard/menu/all-employees']);
      },
      error: (error) => {
        let errorMessage = 'Failed to add Employee';
        if (error.error?.errors) {
          const errorKey = Object.keys(error.error.errors)[0];
          errorMessage = error.error.errors[errorKey]?.[0] || errorMessage;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
        this.isSubmitting = false;
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}