import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IGetAllSubCategories } from "../../Interfaces/q-sub-categories/IGetAllSubCategories";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetSubCategoryById } from "../../Interfaces/q-sub-categories/IGetSubCategoryById";
import { IStoreSubCategoriesResponse } from "../../Interfaces/q-sub-categories/IStoreSubCategoriesResponse";
import { IUpdateSubCategoriesResponse } from "../../Interfaces/q-sub-categories/IUpdateSubCategoriesResponse";
import { IToggleSubCategoryResponse } from "../../Interfaces/q-sub-categories/IToggleSubCategoryResponse";

@Injectable({
  providedIn: "root",
})
export class SubCategoryService {
  private readonly http = inject(HttpClient);

  // Since your API doesn't support pagination, we remove the parameters
  getAllSubCategories() {
    return this.http.get<IGetAllSubCategories>(`${WEB_SITE_BASE_URL}subcategories`);
  }

  getSubCategoryById(CategoryId: string) {
    return this.http.get<IGetSubCategoryById>(`${WEB_SITE_BASE_URL}subcategories/${CategoryId}`);
  }

  addSubCategory(CategoryId: string, categoryData: {}) {
    return this.http.post<IStoreSubCategoriesResponse>(`${WEB_SITE_BASE_URL}subcategories`, categoryData);
  }

  updateSubCategory(CategoryId: string, categoryData: {}) {
    return this.http.post<IUpdateSubCategoriesResponse>(
      `${WEB_SITE_BASE_URL}subcategories/${CategoryId}`,
      categoryData
    );
  }

  destroySubCategory(CategoryId: string) {
    return this.http.post<IToggleSubCategoryResponse>(`${WEB_SITE_BASE_URL}subcategories/${CategoryId}/destroy`, {});
  }

  enableSubCategory(CategoryId: string) {
    return this.http.post<IToggleSubCategoryResponse>(`${WEB_SITE_BASE_URL}subcategories/${CategoryId}/recover`, {});
  }
}
