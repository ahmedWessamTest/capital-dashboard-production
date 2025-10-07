import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface StatisticsData {
  users: number
  medicalPolicy: number
  motorPolicy: number
  buildingPolicy: number
  jobPolicy: number
  medicalClaim: number
  motorClaim: number
  buildingClaim: number
  jobClaim: number
  medicalPolicyConfirmed: number
  motorPolicyConfirmed: number
  buildingPolicyConfirmed: number
  jobPolicyConfirmed: number
  medicalPolicyCancelled: number
  motorPolicyCancelled: number
  buildingPolicyCancelled: number
  jobPolicyCancelled: number
  medicalPolicyPending: number
  motorPolicyPending: number
  buildingPolicyPending: number
  jobPolicyPending: number
  medicalClaimConfirmed: number
  motorClaimConfirmed: number
  buildingClaimConfirmed: number
  jobClaimConfirmed: number
  medicalClaimCancelled: number
  motorClaimCancelled: number
  buildingClaimCancelled: number
  jobClaimCancelled: number
  medicalClaimPending: number
  motorClaimPending: number
  buildingClaimPending: number
  jobClaimPending: number
}

@Component({
  selector: 'app-home-statistics',
  templateUrl: './home-statistics.component.html',
  styleUrls: ['./home-statistics.component.scss'],
  standalone: true,
  imports: [ChartModule, NgxSpinnerModule,CommonModule]
})
export class HomeStatisticsComponent implements OnInit,OnDestroy {
  private readonly destroy$ = new Subject<void>()
  statisticsData!: StatisticsData;
  ngxSpinnerService = inject(NgxSpinnerService);
  overviewChartData: any;
  claimsChartData: any;
  policiesChartData: any;
  chartOptions: any;
  isLoading: boolean = true;
usersData: any;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.ngxSpinnerService.show('actionsLoader');
    
    this.getStatisticsData();
this.usersData = JSON.parse(localStorage.getItem('user') || '{}');
console.log(this.usersData);
  }

  getStatisticsData() {
    this.httpClient.get<StatisticsData>('https://digitalbondmena.com/insurance/api/dashboard-home/stathome').pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.statisticsData = res;
        console.log(res);
        
        this.initializeCharts();
        this.isLoading = false;
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
        this.setDefaultData();
        this.initializeCharts();
        this.isLoading = false;
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  private setDefaultData() {
    this.statisticsData = {
      users: 0,
      medicalPolicy: 0,
      motorPolicy: 0,
      buildingPolicy: 0,
      medicalClaim: 0,
      motorClaim: 0,
      buildingClaim: 0,
      medicalPolicyConfirmed: 0,
      motorPolicyConfirmed: 0,
      buildingPolicyConfirmed: 0,
      medicalPolicyCancelled: 0,
      motorPolicyCancelled: 0,
      buildingPolicyCancelled: 0,
  jobClaim:0,
jobClaimCancelled:0,
jobClaimConfirmed:0,
jobClaimPending:0,
jobPolicy:0,
jobPolicyCancelled:0,
jobPolicyConfirmed: 0,
jobPolicyPending:0,
      medicalPolicyPending: 0,
      motorPolicyPending: 0,
      buildingPolicyPending: 0,
      medicalClaimConfirmed: 0,
      motorClaimConfirmed: 0,
      buildingClaimConfirmed: 0,
      medicalClaimCancelled: 0,
      motorClaimCancelled: 0,
      buildingClaimCancelled: 0,
      medicalClaimPending: 0,
      motorClaimPending: 0,
      buildingClaimPending: 0
    };
  }

  initializeCharts() {
    if (!this.statisticsData) return;

    // Shared colors for policies and claims
    const colors = {
      medical: { bg: '#42A5F5', hover: '#2196F3' }, // Blue
      motor: { bg: '#FF5722', hover: '#E64A19' },   // Deep Orange
      building: { bg: '#4CAF50', hover: '#388E3C' }, // Green
      job:{bg:"#702A17",hover:'8a3a22'}
    };

    this.overviewChartData = {
      labels: ['Medical Policies', 'Motor Policies', 'Property Policies', "Professional Indemnity"],
      datasets: [{
        data: [
          this.statisticsData.medicalPolicy,
          this.statisticsData.motorPolicy,
          this.statisticsData.buildingPolicy,
          this.statisticsData.jobPolicy,
        ],
        backgroundColor: [colors.medical.bg, colors.motor.bg, colors.building.bg ,colors.job.bg ],
        hoverBackgroundColor: [colors.medical.hover, colors.motor.hover, colors.building.hover,colors.job.hover]
      }]
    };

    this.claimsChartData = {
      labels: ['Medical Claims', 'Motor Claims', 'Property Claims',"Professional Indemnity"],
      datasets: [{
        data: [
          this.statisticsData.medicalClaim,
          this.statisticsData.motorClaim,
          this.statisticsData.buildingClaim,
          this.statisticsData.jobClaim,
        ],
        backgroundColor: [colors.medical.bg, colors.motor.bg, colors.building.bg,colors.job.bg ],
        hoverBackgroundColor: [colors.medical.hover, colors.motor.hover, colors.building.hover,colors.job.hover ]
      }]
    };

    this.policiesChartData = {
      labels: ['Confirmed', 'Cancelled', 'Pending'],
      datasets: [{
        data: [
          this.statisticsData.medicalPolicyConfirmed + this.statisticsData.motorPolicyConfirmed + this.statisticsData.buildingPolicyConfirmed,
          this.statisticsData.medicalPolicyCancelled + this.statisticsData.motorPolicyCancelled + this.statisticsData.buildingPolicyCancelled,
          this.statisticsData.medicalPolicyPending + this.statisticsData.motorPolicyPending + this.statisticsData.buildingPolicyPending
        ],
        backgroundColor: ['#4CAF50', '#EF5350', '#FFA726'],
        borderColor: ['#388E3C', '#F44336', '#FF9800'],
        borderWidth: 1
      }]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            color: '#495057'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    };
  }

  getTotalPolicies(): number {
    return this.statisticsData ? 
      this.statisticsData.medicalPolicy + 
      this.statisticsData.motorPolicy + 
      this.statisticsData.buildingPolicy : 0;
  }

  getTotalClaims(): number {
    return this.statisticsData ? 
      this.statisticsData.medicalClaim + 
      this.statisticsData.motorClaim + 
      this.statisticsData.buildingClaim : 0;
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}