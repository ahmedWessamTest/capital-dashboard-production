import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { timer } from "rxjs";
import { IAddCategoryBody } from "../../../../../../core/Interfaces/h-category/IAddCategoryBody";
import { IAllCategory } from "../../../../../../core/Interfaces/h-category/IAllCategory";
import { SubCategoryService } from "../../../../../../core/services/q-sub-categories/sub-category.service";
@Component({
  selector: 'app-c-sub-categories-add',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
  ],
  templateUrl: './c-sub-categories-add.component.html',
  styleUrl: './c-sub-categories-add.component.scss',
  providers: [MessageService],
})
export class CSubCategoriesAddComponent {
  submitForm: FormGroup;

  categories: {
    value: string;
    label: string;
  }[] = [];

  isEditing = false;

  errorMessagesArr: string[] = [];

  subCategoryId: string | null = null;

  private fb = inject(FormBuilder);

  private subCategoryService = inject(SubCategoryService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.submitForm = this.fb.group({
      en_name: ['', Validators.required],
      ar_name: ['', Validators.required],
      // en_slug: ['', Validators.required],
      // ar_slug: ['', Validators.required],
      category_id: ['', Validators.required],
      active_status: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.initAllCategories();
    this.initEditData();
  }

  initAllCategories() {
    if (this.activatedRoute.snapshot.data['categories']) {
      this.categories = (
        this.activatedRoute.snapshot.data['categories'] as IAllCategory
      ).data.filter((c)=> c.active_status === 1).map((category: any) => ({
        value: category.id,
        label: category.en_name,
      }));
    }
  }

  initEditData() {
    this.initAllCategories();
    if (this.activatedRoute.snapshot.data['subCategory']) {
      this.isEditing = true;
      this.submitForm.patchValue(
        this.activatedRoute.snapshot.data['subCategory'].data
      );
      this.subCategoryId =
        this.activatedRoute.snapshot.data['subCategory'].data.id;
    }
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    const CategoryData: IAddCategoryBody = this.submitForm.value;

    if (this.isEditing && this.subCategoryId) {
      this.subCategoryService
        .updateSubCategory(this.subCategoryId, CategoryData)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/dashboard/menu/sub-categories']);
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Category updated successfully',
            });
            timer(200).subscribe(() =>
              this.ngxSpinnerService.hide('actionsLoader')
            );
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessagesArr = error.error.errors;
          },
        });
    } else {
      this.subCategoryService.addSubCategory(this.submitForm.value.category_id,CategoryData).subscribe({
        next: (response) => {
          {
            this.router.navigate(['/dashboard/menu/sub-categories']);
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: 'Category added successfully',
            });
            timer(200).subscribe(() =>
              this.ngxSpinnerService.hide('actionsLoader')
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.errors);
        },
      });
    }
  }
}
