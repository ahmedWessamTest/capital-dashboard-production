import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-administrations',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-adminstrations.component.html',
  styleUrls: ['./add-edit-adminstrations.component.scss'],
})
export class AddEditAdminstrationsComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  administrationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.administrationId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(
      (segment) => segment.path === 'add'
    );
    this.isEditMode = !urlContainsAdd && !!this.administrationId;

    if (this.isEditMode) {
      this.loadEditData();
    }

    this.initializeFields();
  }

  loadEditData(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.editData = data?.data || null;
        console.log(this.editData);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load administration:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }

  initializeFields(): void {
    this.formFields = [
      {
        name: 'en_name',
        label: 'English Name',
        type: 'text',
        required: true,
        placeholder: 'English Name',
      },
      {
        name: 'ar_name',
        label: 'Arabic Name',
        type: 'text',
        required: true,
        placeholder: 'Arabic Name',
      },
      {
        name: 'en_job',
        label: 'English Professional Title',
        type: 'text',
        required: true,
        placeholder: 'English Professional Title',
      },
      {
        name: 'ar_job',
        label: 'Arabic Professional Title',
        type: 'text',
        required: true,
        placeholder: 'Arabic Professional Title',
      },
      {
        name: 'admin_image',
        label: 'Admin Image URL',
        type: 'image',
        required: false,
        placeholder: 'Admin Image URL',
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
