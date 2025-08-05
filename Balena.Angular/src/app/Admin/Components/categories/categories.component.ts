import { Component, OnInit } from '@angular/core';
import { AdminPaginationComponent } from "../../Shared/admin-pagination/admin-pagination.component";
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationFormService } from '../../Services/validation-form.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import { AdminFiltersComponent } from "../../Shared/admin-filters/admin-filters.component";
import { FilterModel } from '../../Models/General/FilterModel';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-categories',
  imports: [AdminPaginationComponent, NgFor, NgIf, AdminFiltersComponent, NgbCollapseModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  UserModel: any;
  isFilter = false;
  showLoader = false;
  ItemForm: FormGroup;
  Total = 0;
  CategoryId: any;
  Results: any[] = [];
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
    this.GetAllCategories();
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      categoryId: 0,
      categoryName: ['', [Validators.required, this.formService.noSpaceValidator]]
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.setValue({
      categoryId: item.categoryId,
      categoryName: item.categoryName
    });
  }

  ResetForm() {
    this.ItemForm.reset();
    this.ItemForm.get('categoryId').setValue(0);
    // this.ItemForm.get('InsertUser').setValue(this.UserModel?.userId);
  }

  openAddItemModal(content: any, item: any) {
    this.ResetForm();
    if (item)
      this.FillEditForm(item);

    this.modalService.open(content, {
      size: 'lg',
      scrollable: true,
      centered: true
    });
  }

  openDeleteItemModal(content: any, item: any) {
    this.CategoryId = item.categoryId
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    });
  }

  GetAllCategories() {
    this.adminService.GetAllCategories(this.PagingFilter).subscribe(data => {
      this.Results = data;
    });
  }

  PageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
  }

  FilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
  }

  AddNewItem() {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.ItemForm.valid;

    if (!isValid) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }
    this.showLoader = true;
    if (this.ItemForm.controls['categoryId'].value == 0) {
      this.adminService.AddNewCategory(this.ItemForm.value).subscribe(data => {
        debugger;
        if (data) {
          this.toaster.success('تمت الاضافة بنجاح');
          this.GetAllCategories();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error('لقد حدث خطأ');
        this.showLoader = false;
      });
    } else {
      this.adminService.UpdateCategory(this.ItemForm.value).subscribe(data => {
        debugger;
        if (data) {
          this.toaster.success('تم التعديل بنجاح');
          this.GetAllCategories();
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
    this.adminService.DeleteCategory(this.CategoryId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الحذف بنجاح');
        this.GetAllCategories();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error('لقد حدث خطأ');
      this.showLoader = false;
    });
  }
}
