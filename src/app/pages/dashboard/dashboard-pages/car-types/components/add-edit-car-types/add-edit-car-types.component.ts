import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { CarTypesListResponse, CarTypeResponse } from '../../services/car-types.service';

@Component({
  selector: 'app-add-edit-car-types',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-car-types.component.html',
  styleUrls: ['./add-edit-car-types.component.scss']
})
export class AddEditCarTypesComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  carTypeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.carTypeId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.carTypeId;

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
        console.error('Failed to load car type:', err);
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
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true
      }
    ];
  }
}