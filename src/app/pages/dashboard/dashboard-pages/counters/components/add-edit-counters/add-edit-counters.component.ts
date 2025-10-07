import { Row } from './../../../../../../core/Interfaces/p-users/IGetUserById';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-counters',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-counters.component.html',
  styleUrls: ['./add-edit-counters.component.scss']
})
export class AddEditCountersComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  counterId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.counterId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.counterId;

    if (this.isEditMode) {
      this.loadEditData();
    }

    this.initializeFields();
  }

  loadEditData(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.editData = data.row;
        console.log(this.editData);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load counter:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  initializeFields(): void {
    this.formFields = [
      {
        name: 'en_name',
        label: 'English Name',
        type: 'text',
        required: true,
        placeholder: 'English Name'
      },
      {
        name: 'ar_name',
        label: 'Arabic Name',
        type: 'text',
        required: true,
        placeholder: 'Arabic Name'
      },
      {
        name: 'counter_value',
        label: 'Counter Value',
        type: 'text',
        required: true,
        placeholder: 'Counter Value'
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