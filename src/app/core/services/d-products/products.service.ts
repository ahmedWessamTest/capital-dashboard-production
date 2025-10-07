import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { IGetAllProducts, ProductChoice, ProductResponse,  } from '../../Interfaces/d-products/IGetAllProducts';
import { IGetProductsCategories } from '../../Interfaces/d-products/IGetProductsCategories';
import { IToggleProduct, ToggleChoiceResponse } from '../../Interfaces/d-products/IToggleProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  categoryId = signal(0);
  private ChoiceDataSubject = new BehaviorSubject<any>(null);
  data$ = this.ChoiceDataSubject.asObservable();


  setChoiceData(data: any) {
    this.ChoiceDataSubject.next(data);
  }

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IGetAllProducts> {
    return this.http.get<IGetAllProducts>(`${WEB_SITE_BASE_URL}products`);
  }

  getAllProductsCategories(): Observable<IGetProductsCategories> {
    return this.http.get<IGetProductsCategories>(`${WEB_SITE_BASE_URL}getcategory`);
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${WEB_SITE_BASE_URL}products/${id}`);
  }

  disableProduct(productId: string): Observable<IToggleProduct> {
    return this.http.post<IToggleProduct>(`${WEB_SITE_BASE_URL}products/${productId}/disable`, {});
  }

  enableProduct(productId: string): Observable<IToggleProduct> {
    return this.http.post<IToggleProduct>(`${WEB_SITE_BASE_URL}products/${productId}/enable`, {});
  }

  enableChoice(id: string): Observable<ToggleChoiceResponse> {
    return this.http.post<ToggleChoiceResponse>(`${WEB_SITE_BASE_URL}products/choices/${id}/enable`, {});
  }

  disableChoice(id: string): Observable<ToggleChoiceResponse> {
    return this.http.post<ToggleChoiceResponse>(`${WEB_SITE_BASE_URL}products/choices/${id}/removeChoice`, {});
  }


  
  addChoices(productId: string, formData: FormData)  {
    return this.http.post(`${WEB_SITE_BASE_URL}products/${productId}/choices`, formData);
  }


  updateChoice(choiceId: string, formData: FormData){
    return this.http.post(`${WEB_SITE_BASE_URL}products/choices/${choiceId}`, formData);
  }


  updateProduct(productId: string, formData: FormData) {
    return this.http.post(`${WEB_SITE_BASE_URL}products/${productId}`, formData);
  }
  // getChoiceById(choiceId: string): Observable<ProductChoice> {
  //   return this.http.get<ProductChoice>(`${WEB_SITE_BASE_URL}products/choices/${choiceId}`);
  // }


  addImage(productId: string, formData: FormData) {
    return this.http.post(`${WEB_SITE_BASE_URL}products/${productId}/images`, formData);
  }
  removeImage( imageId: string) {
    return this.http.delete(`${WEB_SITE_BASE_URL}products/images/${imageId}`);
  }
}