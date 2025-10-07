import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-sliders',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-slider.component.html',
  styleUrls: ['./add-edit-slider.component.scss']
})
export class AddEditSliderComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  sliderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.sliderId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.sliderId;

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
        console.error('Failed to load slider:', err);
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
        name: 'image',
        label: 'Slider Image URL',
        type: 'image',
        required: false,
        placeholder: 'Slider Image URL'
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