import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxJoditComponent } from 'ngx-jodit';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Subject, filter, takeUntil } from 'rxjs';
import { IMAGE_BASE_URL } from '../../../core/constants/WEB_SITE_BASE_UTL';
import { FormErrorDirective } from '../../../core/directives/form-error.directive';
import { DataRefreshService } from '../../../core/services/refresh/data-refresh.service';
import { ValidationService } from '../../../core/services/validation/form-validators.service';
import { GenericDataService } from '../../service/genereic-table.service';
import {
  ImageUploadComponent,
  ProductImage,
} from '../image-upload/image-upload.component';

export interface FormField {
  name: string;
  label: string;
  type:
  | 'text'
  | 'number'
  | 'boolean'
  | 'dropdown'
  | 'image'
  | 'date'
  | 'editor';
  required?: boolean;
  validators?: any[];
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  singleImageMode?: boolean;
  disabled?: boolean;
  showIf?: { filed: string, value: string }
}

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputSwitchModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    FormErrorDirective,
    ImageUploadComponent,
    NgxJoditComponent,
  ],
  template: `
    <form [formGroup]="dataForm" (ngSubmit)="onSubmit()">
      <div class="flex flex-col gap-2 pt-8 px-4">
        @if (message.text) {
        <div
          [ngClass]="{
            'bg-green-100 border-green-400 text-green-700':
              message.type === 'success',
            'bg-red-100 border-red-400 text-red-700': message.type === 'error'
          }"
          class="border px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong class="font-bold">{{
            message.type === 'success' ? 'Success!' : 'Error!'
          }}</strong>
          <span class="block sm:inline ml-2">{{ message.text }}</span>
        </div>
        } @for (field of getFieldRows(); track $index) {
        <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
          @for (formField of field; track formField.name) { @if (formField.type
          !== 'image') {
          <div class="form-group flex-1">
            <label
              [for]="formField.name"
              class="flex items-center gap-1 mx-2 mb-2 font-semibold"
            >
              {{ formField.label }}
              @if (formField.disabled) {
              <span class="text-gray-500 text-sm">Read only</span>
              } @if (formField.name === 'end_date') {
              <small class="text-gray-500 italic mt-1 flex items-center">
                (Calculated automatically based on start date and duration)
              </small>
              }
            </label>
            <div class="input-container">
              @if (formField.type === 'number') {
              <input
                [type]="formField.type"
                [id]="formField.name"
                [formControlName]="formField.name"
                [placeholder]="formField.placeholder || formField.label"
                appFormError
                [disabled]="formField.disabled || false"
                [ngClass]="{ 'cursor-disabled': formField.disabled || false }"
                [displayName]="formField.label"
                class="form-input w-full"
                (keypress)="
                  formField.type === 'number' ? numericOnly($event) : null
                "
              />
              } @else if (formField.type === 'dropdown') {
              <p-dropdown
                [id]="formField.name"
                [ngClass]="{
                  'cursor-disabled-drop': formField.disabled || false
                }"
                [formControlName]="formField.name"
                [options]="
                  formField.name === 'duration'
                    ? durationOptions
                    : formField.options || []
                "
                optionLabel="label"
                optionValue="value"
                [placeholder]="'Select ' + formField.label"
                appFormError
                [disabled]="formField.disabled || false"
                [displayName]="formField.label"
                [showClear]="!formField.required"
                [class.ng-dirty]="
                  dataForm.get(formField.name)?.dirty ||
                  dataForm.get(formField.name)?.touched
                "
                [class.ng-invalid]="
                  dataForm.get(formField.name)?.invalid &&
                  (dataForm.get(formField.name)?.dirty ||
                    dataForm.get(formField.name)?.touched)
                "
              >
              </p-dropdown>
              @if (dataForm.get(formField.name)?.invalid &&
              (dataForm.get(formField.name)?.dirty ||
              dataForm.get(formField.name)?.touched)) {
              <small class="text-red-500 mt-1 block">
                {{ formField.label }} is required.
              </small>
              } } @else if (formField.type === 'date') {
              <p-calendar
                [ngClass]="{
                  'cursor-disabled-drop': formField.disabled || false
                }"
                [id]="formField.name"
                [formControlName]="formField.name"
                [dateFormat]="'dd-mm-yy'"
                [placeholder]="formField.placeholder || formField.label"
                [showIcon]="true"
                inputId="icon"
                [readonlyInput]="formField.name === 'end_date'"
                [disabled]="formField.disabled || false"
                [class.ng-dirty]="
                  dataForm.get(formField.name)?.dirty ||
                  dataForm.get(formField.name)?.touched
                "
                [class.ng-invalid]="
                  dataForm.get(formField.name)?.invalid &&
                  (dataForm.get(formField.name)?.dirty ||
                    dataForm.get(formField.name)?.touched)
                "
                class="w-full"
                [maxDate]="formField.name !== 'end_date' ? today : null"
              ></p-calendar>
              @if (dataForm.get(formField.name)?.invalid &&
              (dataForm.get(formField.name)?.dirty ||
              dataForm.get(formField.name)?.touched)) {
              <small class="text-red-500 mt-1 block">
                {{ formField.label }} is required.
              </small>
              } } @else if (formField.type === 'text') {
              <input
                [type]="formField.type"
                [id]="formField.name"
                [formControlName]="formField.name"
                [placeholder]="formField.placeholder || formField.label"
                appFormError
                [disabled]="formField.disabled || false"
                [ngClass]="{ 'cursor-disabled': formField.disabled || false }"
                [displayName]="formField.label"
                class="form-input w-full"
              />
              } @else if(formField.type === 'editor'){
              <ngx-jodit
                id="ar_main_content"
                formControlName="{{ formField.name }}"
                placeholder="Enter Arabic Main Content"
                [options]="{ language: 'ar', direction: 'rtl', height: 400 }"
                class="w-full rich-text-content"
                [ngClass]="{
                  'p-invalid':
                    dataForm.get(formField.name)?.touched &&
                    dataForm.get(formField.name)?.invalid
                }"
                [attr.disabled]="isLoading ? true : null"
              ></ngx-jodit>

              }
            </div>
          </div>
          } } @if (field.length === 1 && field[0].type !== 'image') {
          <div class="form-group flex-1 hidden sm:block"></div>
          }
        </div>
        } @for (formField of fields; track formField.name) { @if (formField.type
        === 'image') {
        <div class="form-group">
          <label class="mx-2 mb-2 font-semibold">{{ formField.label }}</label>
          <app-image-upload
            [initialImages]="initialImageForEdit"
            [singleImageMode]="true"
            [id]="formField.name"
            (imagesChanged)="onImageChanged($event, formField.name)"
          ></app-image-upload>
          @if (dataForm.get(formField.name)?.touched &&
          dataForm.get(formField.name)?.invalid) {
          <small class="text-red-500">
            {{ formField.label }} is required.
          </small>
          }
        </div>
        } }

        <div
          class="flex flex-col sm:flex-row sm:justify-between items-center gap-4"
        >
          @if (hasStatusField) {
          <div class="flex-1">
            <div class="flex gap-2 items-center">
              <p-inputSwitch
                id="active_status"
                formControlName="active_status"
                [ngClass]="{
                  'cursor-disabled': dataForm.get('active_status')?.disabled
                }"
                (onChange)="onActiveStatusChange($event.checked)"
              >
              </p-inputSwitch>
              <label for="active_status" class="text-[14px]">
                {{
                  dataForm.get('active_status')?.value ? 'Active' : 'Inactive'
                }}
              </label>
            </div>
          </div>
          } @else {
          <div class="flex-1"></div>
          }
          @if (hasHomeStatusField) {
          <div class="flex-1">
            <div class="flex gap-2 items-center">
              <p-inputSwitch
                id="home_status"
                formControlName="home_status"
                [ngClass]="{
                  'cursor-disabled': dataForm.get('home_status')?.disabled
                }"
                (onChange)="onActiveHomeStatusChange($event.checked)"
              >
              </p-inputSwitch>
              <label for="home_status" class="text-[14px]">
                {{
                  dataForm.get('home_status')?.value == 1? 'Active In Home' : 'Inactive In Home'
                }}
              </label>
            </div>
          </div>
          } @else {
          <div class="flex-1"></div>
          }

          <div class="flex-1 flex justify-end">
            <button
              class="submit-btn"
              type="submit"
              [disabled]="isLoading || !dataForm.valid"
            >
              {{ isLoading ? 'Loading...' : isEdit ? 'Update' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class GenericFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private genericDataService = inject(GenericDataService);
  private router = inject(Router);
  private addedImageFile: File | null = null;
  private removedImageUrls: string[] = [];
  initialImageForEdit: ProductImage[] = [];
  private dataRefreshService = inject(DataRefreshService);
  private destroy$ = new Subject<void>();
  today = new Date();

  @Input() extraFormData: { [key: string]: string | number } = {};
  @Input() fields: FormField[] = [];
  @Input() entityType: string = '';
  @Input() title: string = 'Data';
  @Input() redirectRoute: string = '';
  @Input() isEdit: boolean = false;
  @Input() editData?: any;
  @Input() category!: 'medical' | 'motor' | 'building' | 'jop' | 'job';
  @Input() changeStatus: boolean = false;

  dataForm!: FormGroup;
  isLoading = false;
  hasStatusField = false;
  hasHomeStatusField = false;
  message = { text: '', type: '' };

  // Duration options for dropdown
  durationOptions = [
    { label: '1 year', value: '1' },
    { label: '2 years', value: '2' },
    { label: '3 years', value: '3' },
  ];

  ngOnInit() {
    console.log(this.fields);

    this.checkForStatusField();
    this.checkForHomeStatusField();
    this.createForm();
    if (this.isEdit && this.editData) {
      this.patchFormData();
    }
    this.setupDateCalculation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkForStatusField() {
    this.hasStatusField = this.fields.some(
      (field) => field.name === 'active_status' && field.type === 'boolean'
    );
  }
  checkForHomeStatusField() {
    this.hasHomeStatusField = this.fields.some(
      (field) => field.name === 'home_status' && field.type === 'boolean'
    );
  }

  /**
   * Creates a Date object from date components without timezone issues
   * This ensures the date represents the actual local date intended
   */
  private createDateFromComponents(
    year: number,
    month: number,
    day: number
  ): Date {
    return new Date(year, month - 1, day); // month is 0-indexed in JS Date
  }

  /**
   * Formats a Date object to local date string in DD-MM-YYYY format
   * This ensures consistent date formatting without timezone issues
   */
  private formatDateToLocalString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Normalizes date strings to ensure consistent format handling
   * Returns a Date object using local date components
   */
  private normalizeDateString(dateString: string): Date | null {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    const cleanDateString = dateString.trim();
    let year: number, month: number, day: number;

    // Format 1: YYYY-MM-DD or YYYY/MM/DD
    const isoMatch = cleanDateString.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
    );
    if (isoMatch) {
      year = parseInt(isoMatch[1]);
      month = parseInt(isoMatch[2]);
      day = parseInt(isoMatch[3]);
      return this.createDateFromComponents(year, month, day);
    }

    // Format 2: DD-MM-YYYY or DD/MM/YYYY
    const ddmmMatch = cleanDateString.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
    );
    if (ddmmMatch) {
      day = parseInt(ddmmMatch[1]);
      month = parseInt(ddmmMatch[2]);
      year = parseInt(ddmmMatch[3]);
      return this.createDateFromComponents(year, month, day);
    }
    // Format 3: MM/DD/YYYY (US format)
    const mmddMatch = cleanDateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddMatch) {
      month = parseInt(mmddMatch[1]);
      day = parseInt(mmddMatch[2]);
      year = parseInt(mmddMatch[3]);
      return this.createDateFromComponents(year, month, day);
    }

    console.warn(`Unable to parse date: ${dateString}`);
    return null;
  }

  /**
   * Formats a Date object to YYYY-MM-DD format (standardized output)
   */
  private formatDateToStandardString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeActiveStatus(status: any): boolean {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string')
      return status === '1' || status.toLowerCase() === 'true';
    return status === 1;
  }

  getFieldRows(): FormField[][] {
    const nonBooleanFields = this.fields.filter(
      (field) => field.type !== 'boolean'
    );
    const rows: FormField[][] = [];

    for (let i = 0; i < nonBooleanFields.length; i += 2) {
      const row = nonBooleanFields.slice(i, i + 2);
      rows.push(row);
    }

    return rows;
  }

  sanitizeFormInputs() {
    Object.keys(this.dataForm.controls).forEach((key) => {
      if (key === 'active_status' || key === 'end_date' || key === 'duration' || key === "home_status")
        return;

      const field = this.fields.find((f) => f.name === key);
      const control = this.dataForm.get(key);

      if (control) {
        control.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((value) => {
            if (value !== null && value !== undefined) {
              let sanitizedValue: any;
              if (field?.type === 'number') {
                sanitizedValue = this.validationService.sanitizeNumericInput(
                  String(value)
                );
              } else if (field?.type === 'date' && value instanceof Date) {
                return;
              } else {
                sanitizedValue = this.validationService.sanitizeInput(
                  String(value)
                );
              }
              if (sanitizedValue !== value) {
                control.setValue(sanitizedValue, { emitEvent: false });
              }
            }
          });
      }
    });
  }

  numericOnly(event: KeyboardEvent): boolean {
    return this.validationService.numericOnly(event);
  }

  preventInvalidPaste(event: ClipboardEvent): void {
    this.validationService.preventInvalidPaste(event);
  }

  onActiveStatusChange(event: any): void {
    this.dataForm.get('active_status')?.setValue(event);
  }
  onActiveHomeStatusChange(event: any): void {
    this.dataForm.get('home_status')?.setValue(event);
  }

  cleanPastedText(event: ClipboardEvent): void {
    this.validationService.cleanPastedText(event);
  }

  onSubmit() {
    if (this.dataForm.valid) {
      this.isLoading = true;
      this.message = { text: '', type: '' };

      const formData = new FormData();
      const formValues = this.dataForm.getRawValue();


      Object.keys(formValues).forEach((key) => {
        const field = this.fields.find((f) => f.name === key);
        const value = formValues[key];

        if (value === null || value === undefined || value === '') {
          return;
        }
        if (field?.type === 'image') {
          if (this.addedImageFile) {
            formData.append(key, this.addedImageFile, this.addedImageFile.name);
          }
        } else if (field?.type === 'date') {
          const dateValue = formValues[key];
          if (dateValue instanceof Date) {
            // Use local date string format to avoid timezone issues
            formData.append(key, this.formatDateToLocalString(dateValue));
          } else if (dateValue) {
            formData.append(key, dateValue);
          } else {
            formData.append(key, '');
          }
        } else if (key === 'active_status') {
          if (this.changeStatus) {
            formData.append(key, formValues[key]);
          } else {
            formData.append(key, formValues[key] ? '1' : '0');
          }
        } else if (key === 'home_status') {
          if (this.changeStatus) {
            formData.append(key, formValues[key]);
          } else {
            console.log(formValues[key] ? '1' : '0');
            (formValues[key] ? '1' : '0')
            formData.append(key, formValues[key] ? '1' : '0');
          }
        } else if (key === 'duration') {
          formData.append(key, String(formValues[key]));
        } else {
          let value = formValues[key];
          if (value !== null && value !== undefined) {
            if (field?.type === 'number') {
              value = this.validationService.sanitizeNumericInput(
                String(value)
              );
            } else {
              value = this.validationService.sanitizeInput(String(value));
            }
            formData.append(key, value.toString());
          } else {
            formData.append(key, '');
          }
        }
      });

      if (this.isEdit && this.editData?.id) {
        formData.append('id', this.editData.id.toString());
      }
console.log(this.category);
      if (this.category === 'medical') {
        formData.append('category_id', '1');
      } else if (this.category === 'motor') {
        formData.append('category_id', '2');
      } else if (this.category === 'building') {
        formData.append('category_id', '3');
      } else if (this.category === 'jop' ) {
        formData.append('category_id', '5');
      }

      Object.keys(this.extraFormData).forEach((key) => {
        formData.append(key, this.extraFormData[key]?.toString());
      });

      const action$ = this.isEdit
        ? this.genericDataService.update(
          this.entityType,
          this.editData?.id || 0,
          formData
        )
        : this.genericDataService.create(this.entityType, formData);

      action$.subscribe({
        next: (res) => {
          this.message = {
            text: `${this.title} ${this.isEdit ? 'Updated' : 'Added'
              } Successfully`,
            type: 'success',
          };
          setTimeout(() => {
            this.isLoading = false;
            this.addedImageFile = null;
            this.removedImageUrls = [];
            this.initialImageForEdit = [];
            this.dataRefreshService.triggerRefresh();
            console.log('redirect route', this.redirectRoute);
            this.router.navigateByUrl(this.redirectRoute);
            this.message = { text: '', type: '' };
          }, 2000);
        },
        error: (err) => {
          this.message = {
            text: `${this.title} ${this.isEdit ? 'Update' : 'Add'} Failed`,
            type: 'error',
          };
          this.isLoading = false;
          setTimeout(() => {
            this.message = { text: '', type: '' };
          }, 5000);
        },
      });
    }
  }

  onImageChanged(
    event: { added: File[]; removed: string[] },
    fieldName: string
  ) {
    this.addedImageFile = event.added.length > 0 ? event.added[0] : null;
    this.removedImageUrls = event.removed;

    const control = this.dataForm.get(fieldName);

    if (control) {
      if (this.addedImageFile) {
        control.setValue(this.addedImageFile);
        control.setValidators([Validators.required]);
      } else if (
        this.isEdit &&
        this.initialImageForEdit.length > 0 &&
        this.removedImageUrls.length === 0
      ) {
        const originalFilename = this.initialImageForEdit[0].image.replace(
          IMAGE_BASE_URL,
          ''
        );
        control.setValue(originalFilename);
        control.clearValidators();
      } else {
        control.setValue(null);
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
    }
  }
  createForm() {
    const formControls: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      const validators = field.required && !field.showIf
        ? [Validators.required, ...(field.validators || [])]
        : field.validators || [];
      if (field.type === 'image') {
        formControls[field.name] = [null, validators];
      } else if (field.type === 'date') {
        formControls[field.name] = [
          {
            value: null,
            disabled: field.disabled || field.name === 'end_date',
          },
          validators,
        ];
      } else if (field.type === 'dropdown' && field.name === 'duration') {
        formControls[field.name] = [
          { value: '1', disabled: field.disabled },
          validators,
        ];
      } else if (field.type !== 'boolean') {
        formControls[field.name] = [
          { value: '', disabled: field.disabled },
          validators,
        ];
      }
    });

    if (this.hasStatusField) {
      const statusField = this.fields.find((f) => f.name === 'active_status');
      const validators = statusField?.required ? [Validators.required] : [];
      formControls['active_status'] = [
        { value: false, disabled: statusField?.disabled },
        validators,
      ];
    }
    if (this.hasHomeStatusField) {
      const statusField = this.fields.find((f) => f.name === 'home_status');
      const validators = statusField?.required ? [Validators.required] : [];
      formControls['home_status'] = [
        { value: false, disabled: statusField?.disabled },
        validators,
      ];
    }

    this.dataForm = this.fb.group(formControls);
    this.applyShowIfLogic();
    this.applyShowIfHomeStatusLogic()
    this.sanitizeFormInputs();
  }
  private applyShowIfLogic() {
    const statusControl = this.dataForm.get('active_status');
    if (!statusControl) return;

    statusControl.valueChanges.subscribe((value) => {
      this.fields.forEach((field) => {
        if (field.showIf?.filed === 'active_status') {
          const control = this.dataForm.get(field.name);
          if (!control) return;

          if (value === field.showIf.value) {
            // ✅ فعل Validators
            if (field.required) {
              control.addValidators(Validators.required);
            }
            control.enable();
          } else {
            // ❌ ألغي Validators
            control.clearValidators();
            control.disable();
          }
          control.updateValueAndValidity();
        }
      });
    });
  }
  private applyShowIfHomeStatusLogic() {
    const statusControl = this.dataForm.get('home_status');
    if (!statusControl) return;

    statusControl.valueChanges.subscribe((value) => {
      this.fields.forEach((field) => {
        if (field.showIf?.filed === 'home_status') {
          const control = this.dataForm.get(field.name);
          if (!control) return;

          if (value === field.showIf.value) {
            // ✅ فعل Validators
            if (field.required) {
              control.addValidators(Validators.required);
            }
            control.enable();
          } else {
            // ❌ ألغي Validators
            control.clearValidators();
            control.disable();
          }
          control.updateValueAndValidity();
        }
      });
    });
  }




  patchFormData() {
    console.log("edit data:", this.editData);

    const patchData = { ...this.editData };
    console.log('the patch data ', patchData);
    if (this.hasStatusField && 'active_status' in patchData) {
      patchData.active_status = this.normalizeActiveStatus(
        patchData.active_status
      );
    }
    if (this.hasHomeStatusField && 'home_status' in patchData) {
      patchData.home_status = this.normalizeActiveStatus(
        patchData.home_status
      );
    }

    const imageField = this.fields.find((field) => field.type === 'image');
    if (
      this.isEdit &&
      this.editData &&
      imageField &&
      this.editData[imageField.name]
    ) {
      const imageUrl = this.editData[imageField.name];
      const currentTime = new Date().toISOString();
      this.initialImageForEdit = [
        {
          id: `edit-${Date.now()}`,
          image: IMAGE_BASE_URL + imageUrl,
          is_main: true,
          active_status: true,
          created_at: currentTime,
          updated_at: currentTime,
        },
      ];
      this.dataForm.get(imageField.name)?.setValue(imageUrl);
      this.dataForm.get(imageField.name)?.clearValidators();
      this.dataForm.get(imageField.name)?.updateValueAndValidity();
    }

    const finalPatchData: any = {};
    console.log('finalPatchData', patchData);

    Object.keys(patchData).forEach((key) => {
      const field = this.fields.find((f) => f.name === key);
      if (field?.type === 'date' && patchData[key]) {
        // Use the new normalization function to handle different date formats
        const normalizedDate = this.normalizeDateString(patchData[key]);
        finalPatchData[key] = normalizedDate;
      } else if (field?.type === 'dropdown' && field.name === 'duration') {
        const durationValue = patchData[key];
        
        finalPatchData[key] = ['1', '2', '3'].includes(String(durationValue))
          ? String(durationValue)
          : '1';
      } else {
        finalPatchData[key] = patchData[key];
      }
    });

    console.log('finalPatchData after operation', finalPatchData);
    this.dataForm.patchValue(finalPatchData);
    this.calculateEndDate();
  }

  private setupDateCalculation() {
    const startDateControl = this.dataForm.get('start_date');
    const durationControl = this.dataForm.get('duration');
    const endDateControl = this.dataForm.get('end_date');

    if (startDateControl && durationControl && endDateControl) {
      startDateControl.valueChanges
        .pipe(
          filter((value) => value instanceof Date || value === null),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.calculateEndDate();
        });

      durationControl.valueChanges
        .pipe(
          filter((value) => value !== null && value !== undefined),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.calculateEndDate();
        });

      this.calculateEndDate();
    }
  }

  private calculateEndDate() {
    const startDateControl = this.dataForm.get('start_date');
    const durationControl = this.dataForm.get('duration');
    const endDateControl = this.dataForm.get('end_date');

    if (!startDateControl || !durationControl || !endDateControl) {
      return;
    }

    const startDate = startDateControl.value;
    const duration = durationControl.value;

    if (
      startDate instanceof Date &&
      duration &&
      ['1', '2', '3'].includes(duration)
    ) {
      const durationValue = parseInt(duration, 10);

      // Create end date using local date components to avoid timezone issues
      const endDate = this.createDateFromComponents(
        startDate.getFullYear() + durationValue,
        startDate.getMonth() + 1, // getMonth() returns 0-indexed month
        startDate.getDate()
      );

      endDateControl.setValue(endDate, { emitEvent: false });
      endDateControl.disable({ emitEvent: false });
    } else {
      endDateControl.setValue(null, { emitEvent: false });
      endDateControl.disable({ emitEvent: false });
    }
  }
}
