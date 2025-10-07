import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-property-insurance-choices',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-property-insurances-choices.component.html',
  styleUrls: ['./add-edit-property-insurances-choices.component.scss']
})
export class AddEditPropertyInsurancesChoicesComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  buildingInsuranceId: string | null = null;
  choiceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.buildingInsuranceId = this.route.snapshot.paramMap.get('id');
    this.choiceId = this.route.snapshot.paramMap.get('choiceId');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');

    if (this.buildingInsuranceId) {
      this.extraFormData = {
        building_insurance_id: this.buildingInsuranceId
      };
    }

    this.isEditMode = !urlContainsAdd && !!this.choiceId;

    if (this.isEditMode) {
      this.loadEditData();
    }

    this.initializeFields();
  }

  loadEditData(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.editData = data?.data || null;
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load building insurance choice:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  initializeFields(): void {
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
        name: 'en_description',
        label: 'English Description',
        type: 'text',
        required: true,
        placeholder: 'English Description'
      },
      {
        name: 'ar_description',
        label: 'Arabic Description',
        type: 'text',
        required: true,
        placeholder: 'Arabic Description'
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