import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationFormService } from '../../Services/validation-form.service';

@Component({
  selector: 'app-order-table',
  imports: [NgbNavModule, NgFor, NgIf, ReactiveFormsModule,CommonModule],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {
  @Input() isOrderMode = false;
  @Output() TableSelected = new EventEmitter<any>();
  active = 1;
  TableId: any;
  UserModel: any;
  TablesList: any[] = [];
  VacantList: any[] = [];
  OccupiedList: any[] = [];
  ItemForm: FormGroup;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 10
  }

  constructor(private adminService: AdminService, private toaster: ToastrService, private fb: FormBuilder, private formService: ValidationFormService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.FormInit();
    this.GetAllOrderTables();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      tableId: 0,
      tableNumber: ['', [Validators.required, this.formService.noSpaceValidator]],
      isActive: true,
      insertUser: null
    });
  }

  openAddItemModal(content: any, item: any) {
    if (!this.isOrderMode) {
      this.ResetForm();
      if (item)
        this.FillEditForm(item);

      this.modalService.open(content, {
        size: 'lg',
        scrollable: true,
        centered: true
      });
    }

  }

  FillEditForm(item: any) {
    this.ItemForm.setValue({
      tableId: item.tableId,
      tableNumber: item.tableNumber,
      isActive: true,
      insertUser: this.UserModel?.userId
    });
  }

  ResetForm() {
    this.ItemForm.reset();
    this.ItemForm.get('tableId').setValue(0);
    this.ItemForm.get('isActive').setValue(true);
    this.ItemForm.get('insertUser').setValue(this.UserModel?.userId);
  }

  GetAllOrderTables() {
    this.adminService.GetAllOrderTables(this.PagingFilter).subscribe(data => {
      if (data && data.results.length > 0) {
        this.TablesList = data.results;
        this.VacantList = this.TablesList.filter(i => i.isActive);
        this.OccupiedList = this.TablesList.filter(i => !i.isActive);
      }
    });
  }

  getColor(isActive: any): string {
    if (!isActive)
      return 'border-color: #f43118;';
    else
      return 'border-color: #0ea72a;';
  }

  activeCard(item: any) {
    this.TableId = item.tableId;
    this.TablesList.forEach(obj => {
      if (item.tableId == obj.tableId)
        obj.isSelected = true;
      else
        obj.isSelected = false;
    });
  }

  navigateToOrderPage() {
    let activeCard = this.TablesList.find(i => i.isSelected);
    if (!activeCard) {
      this.toaster.warning('برجاء اختيار طاولة');
      return;
    }
    if (activeCard.orderId) {
      this.toaster.warning('برجاء اختيار طاولة شاغرة');
      return;
    }
    this.TableSelected.emit(activeCard?.tableNumber);
  }

  FinishOrderTable() {
    if (this.TableId) {
      this.adminService.FinishOrderTable(this.TableId).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllOrderTables();
        } else {
          this.toaster.error(data.message);
        }
      });
    }
    else {
      this.toaster.warning('برجاء اختيار الطاولة المراد اغلاقها');
      return;
    }
  }

  AddNewItem() {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.ItemForm.valid;

    if (!isValid) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }

    if (this.ItemForm.controls['tableId'].value == 0) {
      this.adminService.AddNewOrderTable(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllOrderTables();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.adminService.UpdateOrderTable(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllOrderTables();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }

  DeleteItem() {
    this.adminService.DeleteOrderTable(this.TableId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.GetAllOrderTables();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data.message);
    });
  }
}
