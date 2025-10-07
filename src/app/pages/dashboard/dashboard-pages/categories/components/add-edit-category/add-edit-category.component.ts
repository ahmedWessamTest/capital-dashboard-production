// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { CommonModule } from '@angular/common';
// import { GenericFormComponent } from '../../../../../../shared/components/generic-add/generic-add.component';
// import { CategoriesService, Category } from '../../services/categories.service';

// @Component({
//   selector: 'app-add-edit-category',
//   standalone: true,
//   imports: [CommonModule, GenericFormComponent],
//   templateUrl: './add-edit-category.component.html',
//   styleUrls: ['./add-edit-category.component.scss']
// })
// export class AddEditCategoryComponent implements OnInit {
//   formFields: any[] = [];
//   editData: any = null;
//   isEditMode = false;
//   categoryId: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private ngxSpinnerService: NgxSpinnerService,
//     private categoriesService: CategoriesService
//   ) {}

//   ngOnInit(): void {
//     this.categoryId = this.route.snapshot.paramMap.get('id');
//     this.isEditMode = this.categoryId !== null;
// console.log(this.isEditMode);
//     if (this.isEditMode) {
//       this.loadEditData();
//     }

//     this.initializeFields();
//   }

//   loadEditData(): void {


//     console.log(this.categoryId);
//     this.route.data.subscribe({
//       next: ({ data }) => {
//         console.log(data);
//         this.editData = data?.data || null;
//         console.log(this.editData);
//         this.ngxSpinnerService.hide('actionsLoader');
//       },
//       error: (err) => {
//         console.error('Failed to load category:', err);
//         this.ngxSpinnerService.hide('actionsLoader');
//       }
//     });
//   }

//   initializeFields(): void {
//     this.formFields = [
//       {
//         name: 'en_title',
//         label: 'English Title',
//         type: 'text',
//         required: true,
//         placeholder: 'English Title'
//       },
//       {
//         name: 'ar_title',
//         label: 'Arabic Title',
//         type: 'text',
//         required: true,
//         placeholder: 'Arabic Title'
//       },
//       {
//         name: 'en_slug',
//         label: 'English Slug',
//         type: 'text',
//         required: true,
//         placeholder: 'English Slug'
//       },
//       {
//         name: 'ar_slug',
//         label: 'Arabic Slug',
//         type: 'text',
//         required: true,
//         placeholder: 'Arabic Slug'
//       },
//       {
//         name: 'en_small_description',
//         label: 'English Small Description',
//         type: 'text',
//         required: true,
//         placeholder: 'English Small Description'
//       },
//       {
//         name: 'ar_small_description',
//         label: 'Arabic Small Description',
//         type: 'text',
//         required: false,
//         placeholder: 'Arabic Small Description'
//       },
//       {
//         name: 'en_main_description',
//         label: 'English Main Description',
//         type: 'editor',
//         required: true,
//         placeholder: 'English Main Description'
//       },
//       {
//         name: 'ar_main_description',
//         label: 'Arabic Main Description',
//         type: 'editor',
//         required: true,
//         placeholder: 'Arabic Main Description'
//       },
//       {
//         name: 'network_link',
//         label: 'Network Link',
//         type: 'text',
//         required: false,
//         placeholder: 'Network Link'
//       },
//       {
//         name: 'counter_number',
//         label: 'Counter Number',
//         type: 'number',
//         required: false,
//         placeholder: 'Counter Number'
//       },
//       {
//         name: 'en_meta_title',
//         label: 'English Meta Title',
//         type: 'text',
//         required: false,
//         placeholder: 'English Meta Title'
//       },
//       {
//         name: 'ar_meta_title',
//         label: 'Arabic Meta Title',
//         type: 'text',
//         required: false,
//         placeholder: 'Arabic Meta Title'
//       },
//       {
//         name: 'en_meta_description',
//         label: 'English Meta Description',
//         type: 'text',
//         required: false,
//         placeholder: 'English Meta Description'
//       },
//       {
//         name: 'ar_meta_description',
//         label: 'Arabic Meta Description',
//         type: 'text',
//         required: false,
//         placeholder: 'Arabic Meta Description'
//       },
//       {
//         name: 'active_status',
//         label: 'Status',
//         type: 'boolean',
//         required: true
//       }
//     ];
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';
import { NgxJoditComponent } from 'ngx-jodit';
import { NormalizeActiveStatusService } from '../../../../../../core/normalize-active-status/normalize-active-status.service';
import { CategoriesService, CategoryResponse, CategoryFormData } from '../../services/categories.service';
import { EditorModule } from 'primeng/editor';
@Component({
  selector: 'app-add-edit-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    NgxSpinnerModule,
    RouterLink,
    CommonModule,
    InputSwitchModule,
    NgxJoditComponent,
    EditorModule
  ],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.scss'
})
export class AddEditCategoryComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private route = inject(ActivatedRoute);
  private normalizeActiveStatusService = inject(NormalizeActiveStatusService);

  categoryForm!: FormGroup;
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  categoryId: string | null = null;
  message = { text: '', type: '' };

  ngOnInit() {
    this.ngxSpinnerService.show('actionsLoader');
    this.initializeForm();
    this.checkMode();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      en_title: ['', Validators.required],
      ar_title: ['', Validators.required],
      en_small_description: ['', Validators.required],
      ar_small_description: [''],
      en_main_description: ['', Validators.required],
      ar_main_description: ['', Validators.required],
      network_link: [''],
      counter_number: [0],
      en_meta_title: [''],
      ar_meta_title: [''],
      en_meta_description: [''],
      ar_meta_description: [''],
      active_status: [true, Validators.required],
      ar_first_script: ['',Validators.required],
      en_first_script: ['',Validators.required],
    });
    this.categoryForm.markAsPristine();
  }

  checkMode() {
    this.route.url.subscribe(segments => {
      this.isEditMode = segments.some(segment => segment.path.includes('edit'));
      if (this.isEditMode) {
        this.categoryId = this.route.snapshot.paramMap.get('id');
        if (this.categoryId) {
          this.loadCategoryData();
        }
      } else {
        this.ngxSpinnerService.hide('actionsLoader');
      }
    });
  }

  loadCategoryData() {
    this.route.data.subscribe({
      next: (data) => {
        const response = data['data'] as CategoryResponse;
        const category = response.data;
        this.categoryForm.patchValue({
          en_title: category.en_title,
          ar_title: category.ar_title,
          en_small_description: category.en_small_description,
          ar_small_description: category.ar_small_description,
          en_main_description: category.en_main_description,
          ar_main_description: category.ar_main_description,
          network_link: category.network_link,
          counter_number: category.counter_number,
          en_meta_title: category.en_meta_title,
          ar_meta_title: category.ar_meta_title,
          en_meta_description: category.en_meta_description,
          ar_meta_description: category.ar_meta_description,
          active_status: this.normalizeActiveStatusService.normalizeActiveStatus(category.active_status),
          ar_first_script: category['ar_first_script'],
          en_first_script: category['en_first_script'],
        });
        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (error: any) => {
        this.message = { text: error.error?.message || 'Failed to load category data', type: 'error' };
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.message = { text: '', type: '' };
        }, 5000);
      }
    });
  }

  onActiveStatusChange(event: any) {
    this.categoryForm.patchValue({ active_status: event.checked ? true : false });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting = true;
    this.categoryForm.disable();
    this.ngxSpinnerService.show('actionsLoader');
    this.message = { text: '', type: '' };

    const formData: CategoryFormData = this.categoryForm.value;
    formData.active_status = this.categoryForm.value.active_status ? '1' : '0';
    const apiCall = this.isEditMode && this.categoryId
      ? this.categoriesService.update(+this.categoryId, formData)
      : this.categoriesService.create(formData);

    apiCall.subscribe({
      next: (response) => {
        this.message = { text: `Category ${this.isEditMode ? 'Updated' : 'Added'} Successfully`, type: 'success' };
        this.categoryForm.reset();
        this.categoryForm.markAsPristine();
        this.isSubmitting = false;
        this.categoryForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.router.navigate(['/dashboard/menu/categories']);
          this.message = { text: '', type: '' };
        }, 1000);
      },
      error: (error: any) => {
        let errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} category`;
        if (error.error?.errors) {
          const errorFields = Object.keys(error.error.errors);
          if (errorFields.length > 0) {
            errorMessage = error.error.errors[errorFields[0]][0];
          }
        }
        this.message = { text: errorMessage, type: 'error' };
        this.isSubmitting = false;
        this.categoryForm.enable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.ngxSpinnerService.hide('actionsLoader');
        setTimeout(() => {
          this.message = { text: '', type: '' };
        }, 5000);
      }
    });
  }
}