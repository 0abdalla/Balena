import { Component, OnInit } from '@angular/core';
import { AdminPaginationComponent } from "../../Shared/admin-pagination/admin-pagination.component";
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ValidationFormService } from '../../Services/validation-form.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AdminFiltersComponent } from "../../Shared/admin-filters/admin-filters.component";
import { FilterModel } from '../../Models/General/FilterModel';
import { AdminService } from '../../Services/admin.service';
import { RoleCheckerDirective } from '../../Directives/role-checker.directive';

@Component({
  selector: 'app-create-order',
  imports: [AdminPaginationComponent, NgFor, NgIf, AdminFiltersComponent, 
    NgbCollapseModule, ReactiveFormsModule, NgbDropdownModule, CommonModule,RoleCheckerDirective],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  UserModel: any;
  isFilter = false;
  showLoader = false;
  ItemForm: FormGroup;
  Total = 0;
  CategoryId: any;
  ProductId: any;
  OrderId: any;
  Results: any[] = [];
  Categories: any[] = [];
  Products: any[] = [];
  SelectedProducts: any[] = [];
  ProductPrice = 0;
  TotalValue = 0;
  CategoryName = 'اختر فئة';
  ProductName = 'اختر عنصر';
  CategoryValidation = false;
  ProductValidation = false;
  CategoryPagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 500
  }
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 10
  }


  constructor(private modalService: NgbModal, private adminService: AdminService,
    private formService: ValidationFormService, private offcanvasService: NgbOffcanvas,
    private fb: FormBuilder, private toaster: ToastrService) {

  }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.GetAllCategories();
    this.GetAllOrders();
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      quantity: ['', [Validators.required]]
    });
  }

  FillEditForm(item: any) {
    this.OrderId = item.orderId;
    this.GetOrderDetailsByOrderId();
  }

  ResetForm() {
    this.ItemForm.reset();
    this.CategoryId = null;
    this.ProductId = null;
    this.CategoryName = 'اختر فئة';
    this.ProductName = 'اختر عنصر';
    this.Products = [];
    this.OrderId = null;
    this.CategoryValidation = false;
    this.ProductValidation = false;
    // this.ItemForm.get('InsertUser').setValue(this.UserModel?.userId);
  }
  OrderNumber: any;
  OrderDate: any;

  openSidePanel(content: any, item: any) {
    this.OrderId = item.orderId;
    this.OrderNumber = item.orderNumber;
    this.OrderDate = item.orderDate;
    this.GetOrderDetailsByOrderId();
    this.offcanvasService.open(content, { position: 'end' });
  }

  openAddItemModal(content: any, item: any) {
    this.SelectedProducts = [];
    this.ResetForm();
    if (item)
      this.FillEditForm(item);

    this.modalService.open(content, {
      size: 'xl',
      scrollable: true,
      centered: true
    });
  }

  openDeleteItemModal(content: any, item: any) {
    this.OrderId = item.orderId;
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    });
  }

  onCategoryClicked(item: any) {
    this.CategoryId = item.categoryId;
    this.CategoryName = item.categoryName;
    this.CategoryValidation = false;
    this.ProductId = null;
    this.ProductName = 'اختر عنصر';
    this.ItemForm.patchValue({ quantity: null });
    this.Products = [];
    this.GetAllProducts();
  }

  onProductClicked(item: any) {
    this.ProductId = item.productId;
    this.ProductName = item.productName;
    this.ProductPrice = item.price;
    this.ProductValidation = false;
  }

  GetAllCategories() {
    this.adminService.GetAllCategories(this.CategoryPagingFilter).subscribe(data => {
      this.Categories = data;
    });
  }

  GetAllProducts() {
    this.adminService.GetProductsByCategoryId(this.CategoryId).subscribe(data => {
      this.Products = data;
    });
  }

  GetOrderDetailsByOrderId() {
    this.adminService.GetOrderDetailsByOrderId(this.OrderId).subscribe(data => {
      this.SelectedProducts = data.orderDetails.map(i => {
        return {
          productId: i.product.productId,
          productName: i.product.productName,
          categoryName: i.product.category.categoryName,
          quantity: i.quantity,
          price: i.product.price,
          totalValue: i.product.price * Number(i.quantity)
        }
      });
      this.TotalValue = this.SelectedProducts.reduce((sum, item) => sum + (item.totalValue || 0), 0);
    })
  }

  GetAllOrders() {
    this.adminService.GetAllOrders(this.PagingFilter).subscribe(data => {
      this.Results = data;
    });
  }

  PageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetAllOrders();
  }

  FilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.GetAllOrders();
  }

  AddNewItem() {
    let quantity = this.ItemForm.value.quantity;
    let isValid = this.ItemForm.valid;
    this.CategoryValidation = !this.CategoryId;
    this.ProductValidation = !this.ProductId;
    if (!isValid || this.CategoryValidation || this.ProductValidation) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }

    let obj = {
      productId: this.ProductId,
      productName: this.ProductName,
      categoryName: this.CategoryName,
      quantity: quantity,
      price: this.ProductPrice,
      totalValue: this.ProductPrice * Number(quantity)
    };
    let checked = this.SelectedProducts.find(i => i.productId == this.ProductId)
    if (!checked) {
      this.SelectedProducts.push(obj);
      this.TotalValue = this.SelectedProducts.reduce((sum, item) => sum + (item.totalValue || 0), 0);
      this.ResetForm();
    }
    else
      this.toaster.warning('هذا العنصر موجود');
  }

  RemoveItem(index: number) {
    this.SelectedProducts.splice(index, 1);
    this.TotalValue = this.SelectedProducts.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  }

  AddNewOrder() {
    debugger;
    if (this.SelectedProducts.length == 0) {
      this.toaster.warning('برجاء اضافة عنصر واحد على الأقل');
      return;
    }

    let orderObj = {
      orderId: this.OrderId,
      customerID: null,
      totalAmount: this.TotalValue,
      paymentMethod: 'Cash',
      userId: this.UserModel?.userId,
      details: this.SelectedProducts.map(i => {
        return {
          ProductID: i.productId,
          quantity: i.quantity,
          unitPrice: i.totalValue,
        }
      })
    }
    if (!this.OrderId) {
      this.adminService.AddNewOrder(orderObj).subscribe(data => {
        if (data) {
          this.toaster.success('تمت الاضافة بنجاح');
          this.GetAllOrders();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error('لقد حدث خطأ');
        this.showLoader = false;
      });
    } else {
      this.adminService.UpdateOrder(orderObj).subscribe(data => {
        if (data) {
          this.toaster.success('تم التعديل بنجاح');
          this.GetAllOrders();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error('لقد حدث خطأ');
        this.showLoader = false;
      });
    }
  }

  DeleteItem() {
    this.showLoader = true;
    this.adminService.DeleteOrder(this.OrderId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الحذف بنجاح');
        this.GetAllOrders();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error('لقد حدث خطأ');
      this.showLoader = false;
    });
  }
}
