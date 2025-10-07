import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';

@Component({
  selector: 'app-add-edit-testimonials',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-testimonial.component.html',
  styleUrls: ['./add-edit-testimonial.component.scss'],
})
export class AddEditTestimonialComponent implements OnInit {
  formFields: any[] = [];
  editData: any = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  testimonialId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.testimonialId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(
      (segment) => segment.path === 'add'
    );
    this.isEditMode = !urlContainsAdd && !!this.testimonialId;

    if (this.isEditMode) {
      this.loadEditData();
    }

    this.initializeFields();
    this.ngxSpinnerService.hide('actionsLoader');
  }

  loadEditData(): void {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.editData = data?.data || null;
        console.log(this.editData);
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load testimonial:', err);
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
        name: 'en_text',
        label: 'English Testimonial Text',
        type: 'text',
        required: true,
        placeholder: 'English Testimonial Text',
      },
      {
        name: 'ar_text',
        label: 'Arabic Testimonial Text',
        type: 'text',
        required: true,
        placeholder: 'Arabic Testimonial Text',
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
