import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-clients',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.scss']
})
export class AddEditClientComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  clientId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.clientId;

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
        console.error('Failed to load client:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  initializeFields(): void {
    this.formFields = [
      {
        name: 'en_client_name',
        label: 'English Client Name',
        type: 'text',
        required: true,
        placeholder: 'English Client Name'
      },
      {
        name: 'ar_client_name',
        label: 'Arabic Client Name',
        type: 'text',
        required: true,
        placeholder: 'Arabic Client Name'
      },
      {
        name: 'client_image',
        label: 'Client Image URL',
        type: 'image',
        required: false,
        placeholder: 'Client Image URL'
      }
    ];
  }
}