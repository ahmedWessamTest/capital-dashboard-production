import { Partner } from './../../services/parteners.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-partners',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-parteners.component.html',
  styleUrls: ['./add-edit-parteners.component.scss']
})
export class AddEditPartnersComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  categoriesData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  partnerId: string | null = null;
  categoryOptions: { label: string; value: string }[] = [];
  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.partnerId;

    if (this.isEditMode) {
      this.loadEditData();
    }

    this.initializeFields();
  }


  loadEditData(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        console.log("data", data.partner.data)
        this.editData = data?.partner.data || null;
        this.categoriesData = data?.categories.data || null;
        console.log(this.editData);
        console.log(this.categoriesData);
        this.ngxSpinnerService.hide('actionsLoader');
        this.categoryOptions = this.categoriesData.map((category: any) => ({
          label: category.en_title || 'Unnamed category',
          value: category.id.toString()
        }));
      },
      error: (err) => {
        console.error('Failed to load partner:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
    this.ngxSpinnerService.hide('actionsLoader');

  }

  initializeFields(): void {
    this.formFields = [
      {
        name: 'category_id',
        label: 'Category',
        type: 'dropdown',
        required: true,
        options: [
          { label: 'Medical', value: '1' },
          { label: 'Motor', value: '2' },
          {
            label: 'property',
            value: '3'
          },
          {
            label: 'professional',
            value: '5'
          }
        ],
        placeholder: this.categoryOptions.length ? 'Select Category' : 'No Categories Available'
      },
      {
        name: 'en_partner_name',
        label: 'English Partner Name',
        type: 'text',
        required: true,
        placeholder: 'English Partner Name'
      },
      {
        name: 'ar_partner_name',
        label: 'Arabic Partner Name',
        type: 'text',
        required: true,
        placeholder: 'Arabic Partner Name'
      },
      {
        name: 'partner_image',
        label: 'Partner Image URL',
        type: 'image',
        required: false,
        placeholder: 'Partner Image URL'
      },
      {
        name: 'active_status',
        label: 'Status',
        type: 'boolean',
        required: true
      },
      {
        name: 'home_status',
        label: 'Status',
        type: 'boolean',
        required: true,
      }
    ];
  }
}
