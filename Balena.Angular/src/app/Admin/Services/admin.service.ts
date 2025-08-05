import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagingFilterModel } from '../Models/General/PagingFilterModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // ============================= Category ==============================

  GetAllCategories(Model: PagingFilterModel) {
    return this.http.post<any[]>(this.apiURL + 'Category/GetAllCategories', Model);
  }

  AddNewCategory(Model: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    return this.http.post<any>(this.apiURL + 'Category/AddNewCategory', Model, { headers });
  }

  UpdateCategory(Model: any) {
    return this.http.post<any>(this.apiURL + 'Category/UpdateCategory', Model);
  }

  DeleteCategory(CategoryId: number) {
    return this.http.get<any>(this.apiURL + 'Category/DeleteCategory?CategoryId=' + CategoryId);
  }

  // ============================= Product ==============================

  GetAllProducts(Model: PagingFilterModel) {
    return this.http.post<any[]>(this.apiURL + 'Product/GetAllProducts', Model);
  }

  GetProductsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.apiURL + 'Product/GetProductsByCategoryId?CategoryId=' + CategoryId);
  }

  AddNewProduct(Model: any) {
    return this.http.post<any>(this.apiURL + 'Product/AddNewProduct', Model);
  }

  UpdateProduct(Model: any) {
    return this.http.post<any>(this.apiURL + 'Product/UpdateProduct', Model);
  }

  DeleteProduct(ProductId: number) {
    return this.http.get<any>(this.apiURL + 'Product/DeleteProduct?ProductId=' + ProductId);
  }

  // ============================= Order ==============================

  GetAllOrders(Model: PagingFilterModel) {
    return this.http.post<any[]>(this.apiURL + 'Order/GetAllOrders', Model);
  }

  GetOrderDetailsByOrderId(OrderId: number) {
    return this.http.get<any>(this.apiURL + 'Order/GetOrderDetailsByOrderId?OrderId=' + OrderId);
  }

  AddNewOrder(Model: any) {
    return this.http.post<any>(this.apiURL + 'Order/AddNewOrder', Model);
  }

  UpdateOrder(Model: any) {
    return this.http.post<any>(this.apiURL + 'Order/UpdateOrder', Model);
  }

  DeleteOrder(OrderId: number) {
    return this.http.get<any>(this.apiURL + 'Order/DeleteOrder?OrderId=' + OrderId);
  }

  // ============================= Auth ==============================

  GetAllUsers() {
    return this.http.get<any[]>(this.apiURL + 'Auth/GetAllUsers');
  }

  GetStatisticsHome() {
    return this.http.get<any>(this.apiURL + 'Auth/GetStatisticsHome');
  }

  CreateUser(Model: any) {
    return this.http.post<any>(this.apiURL + 'Auth/CreateUser', Model);
  }

  EditUser(Model: any) {
    return this.http.post<any>(this.apiURL + 'Auth/EditUser', Model);
  }

  DeleteUser(UserId: string) {
    return this.http.get<any>(this.apiURL + 'Auth/DeleteUser?UserId=' + UserId);
  }
}
