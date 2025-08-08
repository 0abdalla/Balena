import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PagingFilterModel } from '../Models/General/PagingFilterModel';
import { ApiResponseModel } from '../Models/General/ApiResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // ============================= Category ==============================

  GetAllCategories(Model: PagingFilterModel) {
    return this.http.post<ApiResponseModel<any[]>>(this.apiURL + 'Category/GetAllCategories', Model);
  }

  AddNewCategory(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Category/AddNewCategory', Model);
  }

  UpdateCategory(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Category/UpdateCategory', Model);
  }

  DeleteCategory(CategoryId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Category/DeleteCategory?CategoryId=' + CategoryId);
  }

  // ============================= Product ==============================

  GetAllProducts(Model: PagingFilterModel) {
    return this.http.post<ApiResponseModel<any[]>>(this.apiURL + 'Product/GetAllProducts', Model);
  }

  GetProductsByCategoryId(CategoryId: number) {
    return this.http.get<ApiResponseModel<any[]>>(this.apiURL + 'Product/GetProductsByCategoryId?CategoryId=' + CategoryId);
  }

  AddNewProduct(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Product/AddNewProduct', Model);
  }

  UpdateProduct(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Product/UpdateProduct', Model);
  }

  DeleteProduct(ProductId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Product/DeleteProduct?ProductId=' + ProductId);
  }

  // ============================= Order ==============================

  GetAllOrders(Model: PagingFilterModel) {
    return this.http.post<ApiResponseModel<any[]>>(this.apiURL + 'Order/GetAllOrders', Model);
  }

  GetOrderDetailsByOrderId(OrderId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Order/GetOrderDetailsByOrderId?OrderId=' + OrderId);
  }

  GetOrderWithDetailsByOrderId(OrderId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Order/GetOrderWithDetailsByOrderId?OrderId=' + OrderId);
  }

  AddNewOrder(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Order/AddNewOrder', Model);
  }

  UpdateOrder(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Order/UpdateOrder', Model);
  }

  CancelOrder(VoidReason: string, Action: string, VoidNotes: string, OrderId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Order/CancelOrder?VoidReason=' + VoidReason + '&Action=' + Action + '&VoidNotes=' + VoidNotes + '&OrderId=' + OrderId);
  }

  // ============================= Auth ==============================

  GetAllUsers() {
    return this.http.get<ApiResponseModel<any[]>>(this.apiURL + 'Auth/GetAllUsers');
  }

  GetStatisticsHome() {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Auth/GetStatisticsHome');
  }

  CreateUser(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/CreateUser', Model);
  }

  EditUser(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/EditUser', Model);
  }

  DeleteUser(UserId: string) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Auth/DeleteUser?UserId=' + UserId);
  }

  // ============================= OrderTable ==============================

  GetAllOrderTables(Model: PagingFilterModel) {
    return this.http.post<ApiResponseModel<any[]>>(this.apiURL + 'OrderTable/GetAllOrderTables', Model);
  }

  AddNewOrderTable(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'OrderTable/AddNewOrderTable', Model);
  }

  UpdateOrderTable(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'OrderTable/UpdateOrderTable', Model);
  }

  DeleteOrderTable(TableId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'OrderTable/DeleteOrderTable?TableId=' + TableId);
  }

  FinishOrderTable(TableId: number) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'OrderTable/FinishOrderTable?TableId=' + TableId);
  }

}
