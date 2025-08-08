import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../Services/admin.service';
import { ValidationFormService } from '../../Services/validation-form.service';
import { ToastrService } from 'ngx-toastr';
import { AdminPaginationComponent } from "../../Shared/admin-pagination/admin-pagination.component";
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-user',
  imports: [AdminPaginationComponent, NgFor, NgIf, ReactiveFormsModule, CommonModule, NgbDropdownModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements OnInit {
  UsersData: any[] = [];
  ItemForm: FormGroup;
  UserId: any;
  RoleName: any;
  RoleNameAr = '--الصلاحيات--';
  Roles = [
    { nameEn: 'SupperAdmin', nameAr: 'مدير' },
    { nameEn: 'Admin', nameAr: 'موظف' }
  ];
  RoleValidation = false;
  ManagerUserId = '321db4e1-e32b-4aeb-8802-b076f9d7227d';
  TotalCount = 0;

  constructor(private modalService: NgbModal, private adminService: AdminService, private formService: ValidationFormService
    , private fb: FormBuilder, private toaster: ToastrService) {

  }

  ngOnInit(): void {
    this.FormInit();
    this.GetAllUsers();
  }

  FormInit(isEditMode: boolean = false) {
    this.ItemForm = this.fb.group({
      userId: null,
      userName: ['', [Validators.required, Validators.pattern("^[a-zA-Z \\-']+")]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: [
        '',
        isEditMode
          ? [Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$")]
          : [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$")]
      ],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      role: null
    });
  }

  FillEditForm(item: any) {
    this.RoleName = item?.role;
    this.RoleNameAr = item?.roleNameAr;
    this.UserId = item.userId;
    this.ItemForm.setValue({
      userId: item.userId,
      userName: item.userName,
      email: item.email,
      password: null,
      phoneNumber: item.phoneNumber,
      address: item?.address,
      role: null
    });
  }

  ResetForm() {
    this.ItemForm.reset();
    this.RoleNameAr = '--الصلاحيات--';
    this.RoleName = '';
    this.RoleValidation = false;
    this.ItemForm.get('userId').setValue(0);
  }

  NumbersOnly(key: any): boolean {
    return this.formService.NumbersOnly(key);
  }

  openAddUserModal(content: any, item: any) {
    if (item) {
      this.FormInit(true);
      this.FillEditForm(item);
    } else {
      this.FormInit(false);
      this.ResetForm();
    }

    this.modalService.open(content, {
      size: 'xl',
      scrollable: true,
      centered: true
    });
  }

  openDeleteUserModal(content: any, userId: any) {
    this.UserId = userId;
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    });
  }

  RoleChange(role: any) {
    this.RoleNameAr = role.nameAr;
    this.RoleName = role.nameEn;
    this.RoleValidation = false
  }

  GetAllUsers() {
    this.adminService.GetAllUsers().subscribe(data => {
      this.UsersData = data.results;
      this.UsersData.forEach(item => {
        let role = this.Roles.find(i => i.nameEn == item.role);
        if (role)
          item.roleNameAr = role.nameAr;
      });
      this.TotalCount = this.UsersData.length;
    })
  }

  AddNewUser() {
    let isValid = this.ItemForm.valid;
    this.RoleValidation = !this.RoleName;
    if (!isValid || this.RoleValidation) {
      this.formService.validateAllFormFields(this.ItemForm);
      return;
    }
    this.ItemForm.patchValue({ role: this.RoleName });
    if (!this.ItemForm.controls['userId'].value) {
      this.adminService.CreateUser(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllUsers();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      if (this.ManagerUserId == this.UserId) {
        this.toaster.warning('لا يمكن التعديل على هذا المستخدم');
        return;
      }
      this.adminService.EditUser(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllUsers();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }

  DeleteUser() {
    if (this.ManagerUserId == this.UserId) {
      this.toaster.warning('لا يمكن حذف هذا المستخدم');
      return;
    }
    this.adminService.DeleteUser(this.UserId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.GetAllUsers();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data.message);
    });
  }
}
