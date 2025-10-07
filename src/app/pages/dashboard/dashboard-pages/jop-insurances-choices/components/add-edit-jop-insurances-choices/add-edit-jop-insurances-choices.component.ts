import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-jop-insurance-choices',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-jop-insurances-choices.component.html',
  styleUrls: ['./add-edit-jop-insurances-choices.component.scss'],
})
export class AddEditJopInsurancesChoicesComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  jopInsuranceId: string | null = null;
  choiceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.jopInsuranceId = this.route.snapshot.paramMap.get('id');
    this.choiceId = this.route.snapshot.paramMap.get('choiceId');
    const urlContainsAdd = this.route.snapshot.url.some(
      (segment) => segment.path === 'add'
    );

    if (this.jopInsuranceId) {
      this.extraFormData = {
        jop_insurance_id: this.jopInsuranceId,
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
        console.error('Failed to load job insurance choice:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }

  initializeFields(): void {
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
        name: 'en_description',
        label: 'English Description',
        type: 'text',
        required: true,
        placeholder: 'English Description',
      },
      {
        name: 'ar_description',
        label: 'Arabic Description',
        type: 'text',
        required: true,
        placeholder: 'Arabic Description',
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true,
      },
    ];
  }
}
