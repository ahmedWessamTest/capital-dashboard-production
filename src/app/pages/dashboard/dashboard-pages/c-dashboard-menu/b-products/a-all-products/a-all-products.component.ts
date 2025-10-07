// import { CommonModule, NgOptimizedImage } from "@angular/common";
// import { Component, inject } from "@angular/core";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { Router, RouterLink } from "@angular/router";
// import { NgxSpinnerService } from "ngx-spinner";
// import { MessageService } from "primeng/api";
// import { ButtonModule } from "primeng/button";
// import { DialogModule } from "primeng/dialog";
// import { DropdownModule } from "primeng/dropdown";
// import { InputSwitchModule } from "primeng/inputswitch";
// import { Table, TableModule } from "primeng/table";
// import { ToastModule } from "primeng/toast";
// import { IGetAllProducts, ProductData } from "../../../../../../core/Interfaces/d-products/IGetAllProducts";
// import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
// import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
// import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";
// import { CategoriesService } from "../../../../../../core/services/h-category/categories.service";
// import { IAllCategory } from "../../../../../../core/Interfaces/h-category/IAllCategory";
// import { ProductsService } from './../../../../../../core/services/d-products/products.service';

// @Component({
//   selector: "app-a-all-products",
//   standalone: true,
//   imports: [
//     ButtonModule,
//     DialogModule,
//     ReactiveFormsModule,
//     TableModule,
//     FormsModule,
//     DropdownModule,
//     ToastModule,
//     InputSwitchModule,
//     LoadingDataBannerComponent,
//     CommonModule,
//     RouterLink,
//     NgOptimizedImage,
//     NoDataFoundBannerComponent,
//   ],
//   templateUrl: "./a-all-products.component.html",
//   styleUrl: "./a-all-products.component.scss",
//   providers: [MessageService],
// })
// export class AAllProductsComponent {
//   products: ProductData[] = [];
//   allCategories!: IAllCategory;
//   filteredProducts: ProductData[] = [];
//   categoryData!: {
//     value: number;
//     label: string;
//   }[];
//   commercialStatusData!: {
//     value: number;
//     label: string;
//   }[];
//   allProducts!: IGetAllProducts;
//   private ngxSpinnerService = inject(NgxSpinnerService);
//   private messageService = inject(MessageService);
//   private productsService = inject(ProductsService);
//   private categoriesService = inject(CategoriesService);private router = inject(Router);
  
//   // Dropdown
//   selectedStatus: string | null = null;
//   selectedCategory: number | null = null;
//   selectOptions: ISelectOptions[] = [];
  
//   totalRecords: number = 0;
//   rowsPerPage = 10;
//   currentPage = 1;
  
//   marimages: string[] = [];

//   ngOnInit() {
//     this.fetchData();
//     this.initDropDownFilter();
//     this.initCategories();
//   }

//   initDropDownFilter(): void {
//     this.selectOptions = [
//       {
//         label: "Active",
//         value: "true",
//       },
//       {
//         label: "Inactive",
//         value: "false",
//       },
//     ];
//   }

//   initCategories(): void {
//     this.categoriesService.getAllCategories().subscribe((response) => {
//       this.allCategories = response;
//       this.categoryData = this.allCategories.data.map((category) => ({
//         value: category.id,
//         label: category.en_name,
//       }));
//     });
//   }

//   fetchData() {
//     this.ngxSpinnerService.show();
//     this.productsService.getAllProducts().subscribe(
//       (response) => {
//         this.allProducts = response;
//         this.products = response.rows;
//         this.products.forEach((product) => {
//           product.images.forEach((image) => (this.marimages.push("https://digitalbondmena.com/mesoshop/" + image.image)));
//         });
//         this.filteredProducts = [...this.products];
//         this.totalRecords = response.rows.length;
//         this.ngxSpinnerService.hide();
//       },
//       () => {
//         this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Products" });
//         this.ngxSpinnerService.hide();
//       }
//     );
//   }

//   applyFilters(): void {
//     let filtered = [...this.products];

//     // Apply category filter
//     if (this.selectedCategory) {
//       filtered = filtered.filter((product) => product.category && product.category.id === this.selectedCategory);
//     }

//     // Apply status filter
//     if (this.selectedStatus !== null && this.selectedStatus !== '') {
//       filtered = filtered.filter((ele) => ele.active_status.toString() === this.selectedStatus);
//     }

//     this.filteredProducts = filtered;
//     this.totalRecords = filtered.length;
//   }

//   onGlobalFilter(dt: Table, event: any) {
//     const value = event.target.value.toLowerCase();
//     let filtered = [...this.products];

//     // Apply category filter first
//     if (this.selectedCategory) {
//       filtered = filtered.filter((product) => product.category && product.category.id === this.selectedCategory);
//     }

//     // Apply status filter
//     if (this.selectedStatus !== null && this.selectedStatus !== '') {
//       filtered = filtered.filter((ele) => ele.active_status.toString() === this.selectedStatus);
//     }

//     // Apply global search on the filtered dataset
//     if (value) {
//       filtered = filtered.filter((product) => {
//         return (
//           product.id.toString().includes(value) ||
//           product.en_name.toLowerCase().includes(value) ||
//           product.ar_name.toLowerCase().includes(value) ||
//           (product.category && product.category.en_name.toLowerCase().includes(value)) ||
//           (product.category && product.category.ar_name.toLowerCase().includes(value)) ||
//           (product.active_status ? "active" : "inactive").includes(value) ||
//           (product.price && product.price.toString().includes(value))
//         );
//       });
//     }

//     this.filteredProducts = filtered;
//     this.totalRecords = filtered.length;
//   }

//   onFilterChange(value: string | null): void {
//     this.selectedStatus = value;
//     this.applyFilters();
//   }

//   onFilterCategoryChange(categoryId: number | null): void {
//     this.selectedCategory = categoryId;
//     this.applyFilters();
//   }

//   toggleProductStatus(product: ProductData) {
//     this.ngxSpinnerService.show("actionsLoader");
//     this.messageService.clear();
//     const updatedStatus = !product.active_status;
    
//     const update$ = updatedStatus 
//       ? this.productsService.enableProduct(product.id.toString())
//       : this.productsService.disableProduct(product.id.toString());

//     update$.subscribe({
//       next: () => {
//         product.active_status = updatedStatus;
//         this.applyFilters(); // Reapply filters to reflect the updated status
//         this.messageService.add({
//           severity: "success",
//           summary: "Updated",
//           detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
//         });
//         this.ngxSpinnerService.hide("actionsLoader");
//       },
//       error: () => {
//         this.messageService.add({
//           severity: "error",
//           summary: "Error",
//           detail: "Failed to update product status",
//         });
//         this.ngxSpinnerService.hide("actionsLoader");
//       }
//     });
//   }

//   getPagination(): number[] {
//     return [10, 25, 50, 100].sort((a, b) => a - b);
//   }

//   onSort(event: any) {
//     const field = event.field;
//     const order = event.order;
//     this.filteredProducts.sort((a, b) => {
//       let valueA: any;
//       let valueB: any;
//       if (field === "id") {
//         valueA = Number(a.id);
//         valueB = Number(b.id);
//       } else if (field === "en_name") {
//         valueA = a.en_name;
//         valueB = b.en_name;
//       } else if (field === "ar_name") {
//         valueA = a.ar_name;
//         valueB = b.ar_name;
//       } else if (field === "active_status") {
//         valueA = a.active_status;
//         valueB = b.active_status;
//       } else {
//         valueA = (a as any)[field];
//         valueB = (b as any)[field];
//       }
//       if (valueA < valueB) {
//         return order === -1 ? -1 : 1;
//       } else if (valueA > valueB) {
//         return order === -1 ? 1 : -1;
//       } else {
//         return 0;
//       }
//     });
//   }
//   addChoices(id:string){
//     this.router.navigate([`/dashboard/menu/products/products-choice/${id}`]);
//   }
// }

import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { Table, TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { IGetAllProducts, ProductData } from "../../../../../../core/Interfaces/d-products/IGetAllProducts";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";
import { CategoriesService } from "../../../../../../core/services/h-category/categories.service";
import { IAllCategory } from "../../../../../../core/Interfaces/h-category/IAllCategory";
import { ProductsService } from './../../../../../../core/services/d-products/products.service';

@Component({
  selector: "app-a-all-products",
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    InputSwitchModule,
    LoadingDataBannerComponent,
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    NoDataFoundBannerComponent,
  ],
  templateUrl: "./a-all-products.component.html",
  styleUrl: "./a-all-products.component.scss",
  providers: [MessageService],
})
export class AAllProductsComponent {
  products: ProductData[] = [];
  allCategories!: IAllCategory;
  filteredProducts: ProductData[] = [];
  categoryData!: {
    value: number;
    label: string;
  }[];
  commercialStatusData!: {
    value: string;
    label: string;
  }[];
  allProducts!: IGetAllProducts;
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);
  
  // Dropdown
  selectedStatus: string | null = null;
  selectedCategory: number | null = null;
  selectedCommercialStatus: string | null = null;
  selectOptions: ISelectOptions[] = [];
  
  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;
  
  marimages: string[] = [];

  ngOnInit() {
    this.fetchData();
    this.initDropDownFilter();
    this.initCommercialStatusFilter();
    this.initCategories();
  }

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: "Active",
        value: "true",
      },
      {
        label: "Inactive",
        value: "false",
      },
    ];
  }

  initCommercialStatusFilter(): void {
    this.commercialStatusData = [
      {
        label: "Business",
        value: "1",
      },
      {
        label: "User",
        value: "0",
      },
    ];
  }

  initCategories(): void {
    this.categoriesService.getAllCategories().subscribe((response) => {
      this.allCategories = response;
      this.categoryData = this.allCategories.data.map((category) => ({
        value: category.id,
        label: category.en_name,
      }));
    });
  }

  fetchData() {
    this.ngxSpinnerService.show();
    this.productsService.getAllProducts().subscribe(
      (response) => {
        this.allProducts = response;
        this.products = response.rows;
        this.products.forEach((product) => {
          product.images.forEach((image) => (this.marimages.push("https://digitalbondmena.com/mesoshop/" + image.image)));
        });
        this.filteredProducts = [...this.products];
        this.totalRecords = response.rows.length;
        this.ngxSpinnerService.hide();
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Products" });
        this.ngxSpinnerService.hide();
      }
    );
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter((product) => product.category && product.category.id === this.selectedCategory);
    }

    // Apply status filter
    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((ele) => ele.active_status.toString() === this.selectedStatus);
    }

    // Apply commercial status filter
    if (this.selectedCommercialStatus !== null && this.selectedCommercialStatus !== '') {
      filtered = filtered.filter((ele) => String(ele.commercial_status) === this.selectedCommercialStatus);
    }

    this.filteredProducts = filtered;
    this.totalRecords = filtered.length;
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value.toLowerCase();
    let filtered = [...this.products];

    // Apply category filter first
    if (this.selectedCategory) {
      filtered = filtered.filter((product) => product.category && product.category.id === this.selectedCategory);
    }

    // Apply status filter
    if (this.selectedStatus !== null && this.selectedStatus !== '') {
      filtered = filtered.filter((ele) => ele.active_status.toString() === this.selectedStatus);
    }

    // Apply commercial status filter
    if (this.selectedCommercialStatus !== null && this.selectedCommercialStatus !== '') {
      filtered = filtered.filter((ele) => String(ele.commercial_status) === this.selectedCommercialStatus);
    }

    // Apply global search on the filtered dataset
    if (value) {
      filtered = filtered.filter((product) => {
        return (
          product.id.toString().includes(value) ||
          product.en_name.toLowerCase().includes(value) ||
          product.ar_name.toLowerCase().includes(value) ||
          (product.category && product.category.en_name.toLowerCase().includes(value)) ||
          (product.category && product.category.ar_name.toLowerCase().includes(value)) ||
          (product.active_status ? "active" : "inactive").includes(value) ||
          (product.commercial_status ? "business" : "user").includes(value) ||
          (product.price && product.price.toString().includes(value))
        );
      });
    }

    this.filteredProducts = filtered;
    this.totalRecords = filtered.length;
  }

  onFilterChange(value: string | null): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onFilterCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onFilterCommercialChange(value: string | null): void {
    this.selectedCommercialStatus = value;
    this.applyFilters();
  }

  toggleProductStatus(product: ProductData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const updatedStatus = !product.active_status;
    
    const update$ = updatedStatus 
      ? this.productsService.enableProduct(product.id.toString())
      : this.productsService.disableProduct(product.id.toString());

    update$.subscribe({
      next: () => {
        product.active_status = updatedStatus;
        this.applyFilters();
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update product status",
        });
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }

  getPagination(): number[] {
    return [10, 25, 50, 100].sort((a, b) => a - b);
  }

  onSort(event: any) {
    const field = event.field;
    const order = event.order;
    this.filteredProducts.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      if (field === "id") {
        valueA = Number(a.id);
        valueB = Number(b.id);
      } else if (field === "en_name") {
        valueA = a.en_name;
        valueB = b.en_name;
      } else if (field === "ar_name") {
        valueA = a.ar_name;
        valueB = b.ar_name;
      } else if (field === "active_status") {
        valueA = a.active_status;
        valueB = b.active_status;
      } else if (field === "commercial_status") {
        valueA = a.commercial_status;
        valueB = b.commercial_status;
      } else {
        valueA = (a as any)[field];
        valueB = (b as any)[field];
      }
      if (valueA < valueB) {
        return order === -1 ? -1 : 1;
      } else if (valueA > valueB) {
        return order === -1 ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  addChoices(id: string) {
    this.router.navigate([`/dashboard/menu/products/products-choice/${id}`]);
  }
}