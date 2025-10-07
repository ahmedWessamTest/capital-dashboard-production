import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <div class="container mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      <div *ngIf="user" class="bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">User Details</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">ID:</p>
            <p class="font-semibold text-gray-900">{{ user.id }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Name:</p>
            <p class="font-semibold text-gray-900">{{ user.name }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Email:</p>
            <p class="font-semibold text-gray-900">{{ user.email || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Phone:</p>
            <p class="font-semibold text-gray-900">{{ user.phone || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Gender:</p>
            <p class="font-semibold text-gray-900">{{ user.gender || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Birth Date:</p>
            <p class="font-semibold text-gray-900">{{ user.birth_date || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Role:</p>
            <p class="font-semibold text-gray-900">{{ user.role }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-sm text-gray-600">Admin Status:</p>
            <p class="font-semibold text-gray-900">{{ user.admin_status === 1 ? 'Admin' : 'User' }}</p>
          </div>
        </div>

        <!-- Claims Section -->
        <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Claims</h3>

        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-600 mb-2">Medical Claims</h4>
          <div *ngIf="user.medicalclaims && user.medicalclaims.length > 0; else noMedicalClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of user.medicalclaims" class="bg-blue-50 p-4 rounded-md shadow-sm">
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
          <div *ngIf="user.motorclaims && user.motorclaims.length > 0; else noMotorClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of user.motorclaims" class="bg-green-50 p-4 rounded-md shadow-sm">
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
          <div *ngIf="user.buildingclaims && user.buildingclaims.length > 0; else noBuildingClaims"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let claim of user.buildingclaims" class="bg-yellow-50 p-4 rounded-md shadow-sm">
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
          <div *ngIf="user.medicalpolicy && user.medicalpolicy.length > 0; else noMedicalPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of user.medicalpolicy" class="bg-purple-50 p-4 rounded-md shadow-sm">
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
          <div *ngIf="user.motorpolicy && user.motorpolicy.length > 0; else noMotorPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of user.motorpolicy" class="bg-orange-50 p-4 rounded-md shadow-sm">
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
          <div *ngIf="user.buildingpolicy && user.buildingpolicy.length > 0; else noBuildingPolicies"
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let policy of user.buildingpolicy" class="bg-red-50 p-4 rounded-md shadow-sm">
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
      <div *ngIf="!user" class="bg-white shadow-lg rounded-lg p-6 sm:p-8 text-center text-gray-600">
        <p class="text-xl font-semibold">User not found or an error occurred while loading data.</p>
        <p class="mt-2 text-sm">Please check the URL or try again later.</p>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterLink],
 
})
export class UserDetailComponent implements OnInit {
  user:any | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to the 'data' observable provided by the ActivatedRoute
    // The 'userData' key matches the key defined in the route's resolve configuration
    this.route.data.subscribe(data => {
      console.log(data)
      this.user = data['data'].data;
      console.log(this.user)
      console.log('Resolved User Data:', this.user); // For debugging
    });
  }
}
