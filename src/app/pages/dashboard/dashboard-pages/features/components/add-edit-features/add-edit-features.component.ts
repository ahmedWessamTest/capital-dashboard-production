import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
import { FeaturesService, FeatureResponse, Feature } from '../../services/features.service';

@Component({
  selector: 'app-add-edit-features',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './add-edit-features.component.html',
  styleUrls: ['./add-edit-features.component.scss']
})
export class AddEditFeaturesComponent implements OnInit {
  formFields: any[] = [];
  editData: Feature | null = null;
  extraFormData: { [key: string]: string | number } = {};
  isEditMode = false;
  featureId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private featuresService: FeaturesService
  ) {}

  ngOnInit(): void {
    this.featureId = this.route.snapshot.paramMap.get('id');
    const urlContainsAdd = this.route.snapshot.url.some(segment => segment.path === 'add');
    this.isEditMode = !urlContainsAdd && !!this.featureId;

    if (this.isEditMode && this.featureId) {
      this.loadEditData();
    }

    this.initializeFields();
  }

  loadEditData(): void {
    if (!this.featureId) return;
    this.ngxSpinnerService.show('actionsLoader');
    this.featuresService.getById(+this.featureId).subscribe({
      next: (response: FeatureResponse) => {
        this.editData = response.data || null;
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load feature:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  initializeFields(): void {
    this.formFields = [
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