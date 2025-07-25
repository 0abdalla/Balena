import { Component, ElementRef, ViewChild } from '@angular/core';
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { FilterModel } from '../../Models/General/FilterModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ValidationFormService } from '../../Services/validation-form.service';
import { ToastrService } from 'ngx-toastr';
import { AdminPaginationComponent } from "../../Shared/admin-pagination/admin-pagination.component";
import { AdminFiltersComponent } from "../../Shared/admin-filters/admin-filters.component";
import { ApiResponseModel } from '../../Models/General/ApiResponseModel';

@Component({
  selector: 'app-all-pages-design',
  standalone: true,
  imports: [AdminPaginationComponent, AdminFiltersComponent,NgbCollapseModule,NgIf,NgFor,NgbDropdownModule],
  providers: [DatePipe],
  templateUrl: './all-pages-design.component.html',
  styleUrl: './all-pages-design.component.css'
})
export class AllPagesDesignComponent {
  @ViewChild('InputFile') InputFile: ElementRef;
  UserModel: any;
  isFilter = false;
  showLoader = false;
  FilterList: FilterModel[] = [];
  ItemForm: FormGroup;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 10
  }
  ResponseModel:ApiResponseModel<any> = {
    totalCount: 0,
    results: null
  }


  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas,
    private formService: ValidationFormService, private datepipe: DatePipe
    , private fb: FormBuilder, private toaster: ToastrService) {

  }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      id: 0,
      fullName: ['', [Validators.required, this.formService.noSpaceValidator]],
      description: ['', this.formService.noSpaceValidator],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+")]],
      phone2: ['', Validators.pattern("[0-9]+")],
      address: ['', this.formService.noSpaceValidator],
      nationalityId: null,
      faceBook: ['', this.formService.noSpaceValidator],
      welcomeMessage: ['', this.formService.noSpaceValidator],
      InsertUser: null
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.setValue({
      id: item.id,
      fullName: item.fullName,
      description: item?.description,
      phone: item?.phone,
      phone2: item?.phone2,
      address: item?.address,
      nationalityId: item?.nationalityId,
      faceBook: item?.faceBook,
      welcomeMessage: item?.welcomeMessage,
      InsertUser: this.UserModel?.userId
    });
  }

  ResetForm() {
    this.ItemForm.reset();
    this.ItemForm.get('id').setValue(0);
    this.ItemForm.get('InsertUser').setValue(this.UserModel?.userId);
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
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    });
  }

  openCashSidePanel(content: any, item: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  PageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
  }

  FilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
  }

  NumbersOnly(key: any) {
    return this.formService.NumbersOnly(key);
  }

  OpenPdfFileItemModal(content: any) {
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    });
  }
}
