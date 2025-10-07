import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-detail',
  template: `
    <div class="container mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      <div *ngIf="employee" class="bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Employee Details</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">ID:</p>
            <p class="font-semibold text-gray-900">{{ employee.id }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Name:</p>
            <p class="font-semibold text-gray-900">{{ employee.name }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Email:</p>
            <p class="font-semibold text-gray-900">{{ employee.email || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Phone:</p>
            <p class="font-semibold text-gray-900">{{ employee.phone || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Gender:</p>
            <p class="font-semibold text-gray-900">{{ employee.gender || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Birth Date:</p>
            <p class="font-semibold text-gray-900">{{ employee.birth_date || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Role:</p>
            <p class="font-semibold text-gray-900">{{ employee.role }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Admin Status:</p>
            <p class="font-semibold text-gray-900">{{ employee.admin_status === 1 ? 'Admin' : 'User' }} {{employee.admin_status}}</p>
          </div>
        </div>

        <!-- Claims Section -->
        <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Claims</h3>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Medical Claims</h4>
          <div *ngIf="employee.medicalclaims && employee.medicalclaims.length > 0; else noMedicalClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of employee.medicalclaims" class="bg-blue-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-blue-800">Claim #{{ claim.claim_number }}</p>
              <p class="text-sm text-gray-700">Date: {{ claim.claim_date || 'N/A' }}</p>
              <p class="text-sm text-gray-700">Status: <span class="font-semibold text-blue-700">{{ claim.status }}</span></p>
            </div>
          </div>
          <ng-template #noMedicalClaims>
            <p class="text-gray-500 italic">No medical claims found.</p>
          </ng-template>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Motor Claims</h4>
          <div *ngIf="employee.motorclaims && employee.motorclaims.length > 0; else noMotorClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of employee.motorclaims" class="bg-green-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-green-800">Claim #{{ claim.claim_number }}</p>
              <p class="text-sm text-gray-700">Date: {{ claim.claim_date || 'N/A' }}</p>
              <p class="text-sm text-gray-700">Car: {{ claim.car_brand }} {{ claim.car_model }}</p>
              <p class="text-sm text-gray-700">Status: <span class="font-semibold text-green-700">{{ claim.status }}</span></p>
            </div>
          </div>
          <ng-template #noMotorClaims>
            <p class="text-gray-500 italic">No motor claims found.</p>
          </ng-template>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Building Claims</h4>
          <div *ngIf="employee.buildingclaims && employee.buildingclaims.length > 0; else noBuildingClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of employee.buildingclaims" class="bg-yellow-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-yellow-800">Claim #{{ claim.claim_number }}</p>
              <p class="text-sm text-gray-700">Date: {{ claim.claim_date || 'N/A' }}</p>
              <p class="text-sm text-gray-700">Building Type: {{ claim.building_type }}</p>
              <p class="text-sm text-gray-700">Status: <span class="font-semibold text-yellow-700">{{ claim.status }}</span></p>
            </div>
          </div>
          <ng-template #noBuildingClaims>
            <p class="text-gray-500 italic">No building claims found.</p>
          </ng-template>
        </div>

        <!-- Policies Section -->
        <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Policies</h3>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Medical Policies</h4>
          <div *ngIf="employee.medicalpolicy && employee.medicalpolicy.length > 0; else noMedicalPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of employee.medicalpolicy" class="bg-purple-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-purple-800">Policy #{{ policy.medical_insurance_number }}</p>
              <p class="text-sm text-gray-700">Start: {{ policy.start_date }}</p>
              <p class="text-sm text-gray-700">End: {{ policy.end_date }}</p>
              <p class="text-sm text-gray-700">Duration: {{ policy.duration }}</p>
            </div>
          </div>
          <ng-template #noMedicalPolicies>
            <p class="text-gray-500 italic">No medical policies found.</p>
          </ng-template>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Motor Policies</h4>
          <div *ngIf="employee.motorpolicy && employee.motorpolicy.length > 0; else noMotorPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of employee.motorpolicy" class="bg-orange-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-orange-800">Policy #{{ policy.motor_insurance_number }}</p>
              <p class="text-sm text-gray-700">Car: {{ policy.car_brand }} {{ policy.car_model }}</p>
              <p class="text-sm text-gray-700">Start: {{ policy.start_date }}</p>
              <p class="text-sm text-gray-700">End: {{ policy.end_date }}</p>
            </div>
          </div>
          <ng-template #noMotorPolicies>
            <p class="text-gray-500 italic">No motor policies found.</p>
          </ng-template>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Building Policies</h4>
          <div *ngIf="employee.buildingpolicy && employee.buildingpolicy.length > 0; else noBuildingPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of employee.buildingpolicy" class="bg-red-50 p-4 rounded-md shadow-sm">
              <p class="font-medium text-red-800">Policy #{{ policy.building_insurance_number }}</p>
              <p class="text-sm text-gray-700">Building Type: {{ policy.building_type }}</p>
              <p class="text-sm text-gray-700">Start: {{ policy.start_date }}</p>
              <p class="text-sm text-gray-700">End: {{ policy.end_date }}</p>
            </div>
          </div>
          <ng-template #noBuildingPolicies>
            <p class="text-gray-500 italic">No building policies found.</p>
          </ng-template>
        </div>

      </div>
      <div *ngIf="!employee" class="bg-white shadow-lg rounded-lg p-6 sm:p-8 text-center text-gray-600">
        <p class="text-xl font-semibold">Employee not found or an error occurred while loading data.</p>
        <p class="mt-2 text-sm">Please check the URL or try again later.</p>
      </div>
    </div>
  `,
  styles:"",
  standalone: true,
  imports: [CommonModule],
 
})
export class EmployeeDetailComponent implements OnInit,OnDestroy {
  employee:any | null = null;
  constructor(private route: ActivatedRoute) {}
  private readonly destroy$ = new Subject<void>()
  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log(data)
      this.employee = data['data'].data;
      console.log(this.employee)
      console.log('Resolved employee Data:', this.employee); // For debugging
    });
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
