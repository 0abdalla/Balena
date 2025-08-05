import { Component, OnInit } from '@angular/core';
import { AdminPaginationComponent } from "../../Shared/admin-pagination/admin-pagination.component";
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationFormService } from '../../Services/validation-form.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import { AdminFiltersComponent } from "../../Shared/admin-filters/admin-filters.component";
import { FilterModel } from '../../Models/General/FilterModel';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-items',
  imports: [AdminPaginationComponent, NgFor, NgIf, AdminFiltersComponent, NgbCollapseModule, ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  UserModel: any;
  isFilter = false;
  showLoader = false;
  ItemForm: FormGroup;
  Total = 0;
  CategoryId: any;
  ProductId: any;
  Results: any[] = [];
  Categories: any[] = [];
  CategoryName = 'اختر فئة';
  CategoryValidation = false;
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
    private formService: ValidationFormService,
    private fb: FormBuilder, private toaster: ToastrService) {

  }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.GetAllProducts();
    this.GetAllCategories();
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      productId: 0,
      productName: ['', [Validators.required, this.formService.noSpaceValidator]],
      categoryId: null,
      price: ['', [Validators.required, this.formService.noSpaceValidator]],
      description: null
    });
  }

  FillEditForm(item: any) {
    this.CategoryName = item.categoryName;
    this.CategoryId = item.categoryId;
    this.ItemForm.setValue({
      productId: item.productId,
      productName: item.productName,
      categoryId: item.categoryId,
      price: item.price,
      description: item?.description ? item?.description : null
    });
  }

  ResetForm() {
    this.ItemForm.reset();
    this.ItemForm.get('productId').setValue(0);
    this.CategoryId = null;
    this, this.CategoryName = 'اختر فئة';
    // this.ItemForm.get('InsertUser').setValue(this.UserModel?.userId);
  }

  openAddItemModal(content: any, item: any) {
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
    this.ProductId = item.productId
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
  }

  GetAllCategories() {
    this.adminService.GetAllCategories(this.CategoryPagingFilter).subscribe(data => {
      this.Categories = data;
    });
  }

  GetAllProducts() {
    this.adminService.GetAllProducts(this.PagingFilter).subscribe(data => {
      this.Results = data;
    });
  }

  PageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetAllProducts();
  }

  FilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.GetAllProducts();
  }

  AddNewItem() {
    debugger;
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.ItemForm.valid;
    this.CategoryValidation = !this.CategoryId;
    if (!isValid || this.CategoryValidation) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }
    this.showLoader = true;
    this.ItemForm.patchValue({ categoryId: this.CategoryId });
    if (this.ItemForm.controls['productId'].value == 0) {
      this.adminService.AddNewProduct(this.ItemForm.value).subscribe(data => {
        if (data) {
          this.toaster.success('تمت الاضافة بنجاح');
          this.GetAllProducts();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error('لقد حدث خطأ');
        this.showLoader = false;
      });
    } else {
      this.adminService.UpdateProduct(this.ItemForm.value).subscribe(data => {
        if (data) {
          this.toaster.success('تم التعديل بنجاح');
          this.GetAllProducts();
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
    this.adminService.DeleteProduct(this.CategoryId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الحذف بنجاح');
        this.GetAllProducts();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error('لقد حدث خطأ');
      this.showLoader = false;
    });
  }
}
