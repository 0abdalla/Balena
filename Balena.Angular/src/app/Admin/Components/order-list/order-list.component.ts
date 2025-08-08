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
  selector: 'app-order-list',
  imports: [AdminPaginationComponent, NgFor, NgIf, AdminFiltersComponent,
    NgbCollapseModule, ReactiveFormsModule, NgbDropdownModule, CommonModule, RoleCheckerDirective],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  UserModel: any;
  isFilter = false;
  showLoader = false;
  ItemForm: FormGroup;
  defaultImage = 'Balena_Logo-Black.png';
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
  OrderNumber: any;
  OrderDate: any;
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
    this.GetAllOrders();
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      voidReason: ['', [Validators.required, this.formService.noSpaceValidator]],
      action: null,
      voidNotes: null
    });
  }

  FillEditForm(item: any) {
    this.OrderId = item.orderId;
    this.GetOrderDetailsByOrderId();
  }

  VoidReason: any;
  Notes: any;
  openSidePanel(content: any, item: any) {
    this.OrderId = item.orderId;
    this.OrderNumber = item.orderNumber;
    this.OrderDate = item.orderDate;
    this.VoidReason = item?.voidReason;
    this.Notes = item?.notes;
    this.GetOrderDetailsByOrderId();
    this.offcanvasService.open(content, { position: 'end' });
  }

  openDeleteItemModal(content: any, item: any) {
    this.ItemForm.reset();
    this.OrderId = item.orderId;
    this.modalService.open(content, {
      size: 'lg',
      scrollable: true,
      centered: true
    });
  }


  GetOrderDetailsByOrderId() {
    this.adminService.GetOrderDetailsByOrderId(this.OrderId).subscribe(data => {
      this.SelectedProducts = data.results;
      this.TotalValue = this.SelectedProducts.reduce((sum, item) => sum + (item.totalValue || 0), 0);
    });
  }

  GetAllOrders() {
    this.adminService.GetAllOrders(this.PagingFilter).subscribe(data => {
      this.Results = data.results;
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

  CancelOrder() {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.ItemForm.valid;

    if (!isValid) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }

    let fromValue = this.ItemForm.value;

    this.adminService.CancelOrder(fromValue.voidReason, fromValue.action, fromValue.voidNotes, this.OrderId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.GetAllOrders();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data.message);
      this.showLoader = false;
    });
  }
}
