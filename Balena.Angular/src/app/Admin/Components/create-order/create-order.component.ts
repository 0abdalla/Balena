import { CommonModule, DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../Services/admin.service';
import { PagingFilterModel } from '../../Models/General/PagingFilterModel';
import { OrderTableComponent } from '../order-table/order-table.component';

@Component({
  selector: 'app-create-order',
  imports: [RouterLink, NgFor, NgIf, FormsModule, CommonModule, OrderTableComponent],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  orderModel = {} as any;
  foodItemsList: any[] = [];
  selectedFoodItems: any[] = [];
  addSelectedFoodItem: any;
  categoriesList: any[] = [];
  showLoader: boolean = false;
  isOrderCatOpen = false;
  fullscreenMode = false;
  activeCat = null;
  OrderId: any;
  NoteTxt = '';
  defaultImage = 'balena-2.jpeg';
  keys: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  UserModel: any;
  cashAmount = '';
  amountPaid = '';
  remaining = 0;
  CurrentTime: any;
  ele: any;
  QtyFoodItemInputCounter: any;
  CategoryPagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 100
  }


  constructor(private adminService: AdminService, private toaster: ToastrService, private modalService: NgbModal, private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    this.ele = document.documentElement;
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.OrderId = this.route.snapshot.queryParamMap.get('orderId');
    this.orderModel.totalValue = 0;
    this.GetCurrentTime();
    this.GetAllCategories();
    if (this.OrderId)
      this.GetOrderWithDetailsByOrderId();
  }

  GetOrderWithDetailsByOrderId() {
    this.adminService.GetOrderWithDetailsByOrderId(this.OrderId).subscribe(data => {
      if (data.isSuccess) {
        this.NoteTxt = data?.results?.notes;
        this.orderModel.tableNumber = data?.results?.tableNumber;
        this.orderModel.notes = data?.results?.notes;
        this.orderModel.totalValue = data?.results?.totalValue;
        this.orderModel.tax = data?.results?.tax;
        this.selectedFoodItems = data.results.orderDetails;
      } else {
        this.toaster.error(data.message);
      }
    });
  }

  openExpandModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true })
  }

  openNotesModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true })
  }

  openPayModal(content: any) {
    this.amountPaid = '';
    this.cashAmount = '';
    this.remaining = 0;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  openTableModal(content: any) {
    this.modalService.open(content, { size: 'xl', centered: true, scrollable: true })
  }

  onClickFoodItem(item: any, content: any) {
    if (item.offerPrice != null)
      item.price = item.offerPrice;

    this.addSelectedFoodItem = item;
    this.addSelectedFoodItem.masterQuantity = 1
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetCurrentTime() {
    let intervalClock = setInterval(() => {
      let Time = new Date();
      this.CurrentTime = Time.getHours() + ':' + (Time.getMinutes() < 10 ? '0' : '') + Time.getMinutes()
    }, 1000);
  }

  GetAllCategories() {
    this.showLoader = true;
    this.adminService.GetAllCategories(this.CategoryPagingFilter).subscribe((data) => {
      this.categoriesList = data.results;
    });
  }

  GetProductsByCategoryId(CategoryId: any) {
    this.adminService.GetProductsByCategoryId(CategoryId).subscribe(data => {
      this.foodItemsList = data.results;
    });
  }

  changeMasterItemQuantity(quantity: number, item: any) {
    item.masterQuantity = parseInt(item.masterQuantity) + quantity;
    if (item.masterQuantity == 0) {
      item.masterQuantity = 1;
    }
  }

  GetItemQuantityNumbers(key: any) {
    if (key == 'C') {
      this.addSelectedFoodItem.masterQuantity = '1';
      this.QtyFoodItemInputCounter = 0;
    }
    else {
      if (this.QtyFoodItemInputCounter == 0)
        this.addSelectedFoodItem.masterQuantity = key;
      else
        this.addSelectedFoodItem.masterQuantity = this.addSelectedFoodItem.masterQuantity + key;

      this.QtyFoodItemInputCounter = this.QtyFoodItemInputCounter + 1;
    }
  }

  createMasterItems() {
    if (this.addSelectedFoodItem.masterQuantity && this.addSelectedFoodItem.masterQuantity > 0) {
      let obj = {
        productId: this.addSelectedFoodItem.productId,
        productName: this.addSelectedFoodItem.productName,
        image: this.addSelectedFoodItem.image,
        quantity: this.addSelectedFoodItem.masterQuantity,
        price: this.addSelectedFoodItem.price,
        totalValue: this.addSelectedFoodItem.price * Number(this.addSelectedFoodItem.masterQuantity)
      };
      this.selectedFoodItems.push(obj);
      this.calculateOrderSummary();
      this.modalService.dismissAll();
    }
    else
      this.toaster.error('Please Insert Quantity');
  }

  removeItem(index: number) {
    this.selectedFoodItems.splice(index, 1);
    this.calculateOrderSummary();
  }

  saveOrderNotes() {
    this.orderModel.notes = this.NoteTxt;
  }

  clearAllNotes() {
    this.NoteTxt = '';
  }

  calculateOrderSummary() {
    this.orderModel.totalValue = 0;
    this.selectedFoodItems.map(item => {
      this.orderModel.totalValue += item.totalValue;
    });
  }

  onAmountPaidChange() {
    if (this.cashAmount)
      this.remaining = Number(this.cashAmount) - this.orderModel.totalValue;
    else
      this.remaining = 0;
  }

  NumbersOnly(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }

  GetPayInputNumbers(key: any) {
    if (key == 'C')
      this.cashAmount = '';
    else
      this.cashAmount = this.cashAmount + key;
    this.onAmountPaidChange()
  }

  getTableNumberSelected(tableNumber: any) {
    this.orderModel.tableNumber = tableNumber;
    this.modalService.dismissAll();
  }

  toggleFullscreenWindow() {
    this.fullscreenMode = !this.fullscreenMode;
    if (this.fullscreenMode) {
      if (this.ele.requestFullscreen) {
        this.ele.requestFullscreen();
      } else if (this.ele.mozRequestFullScreen) {
        this.ele.mozRequestFullScreen();
      } else if (this.ele.webkitRequestFullscreen) {
        this.ele.webkitRequestFullscreen();
      } else if (this.ele.msRequestFullscreen) {
        this.ele.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }

  resetOrderModel() {
    this.orderModel = {};
    this.selectedFoodItems = [];
    this.foodItemsList = [];
    this.orderModel.totalValue = 0;
    this.OrderId = null;
    this.cashAmount = '';
    this.amountPaid = '';
    this.NoteTxt = '';
    this.remaining = 0;
  }

  createOrder() {
    if (this.selectedFoodItems.length == 0) {
      this.toaster.warning('برجاء اضافة عنصر واحد على الأقل');
      return;
    }

    this.orderModel.customerID = null;
    this.orderModel.totalAmount = this.orderModel.totalValue;
    this.orderModel.tax = 0;
    this.orderModel.paymentMethod = 'Cash';
    this.orderModel.userId = this.UserModel?.userId;
    this.orderModel.details = this.selectedFoodItems.map(i => {
      return {
        ProductID: i.productId,
        quantity: i.quantity,
        unitPrice: i.totalValue,
      }
    });


    if (!this.OrderId) {
      this.adminService.AddNewOrder(this.orderModel).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.resetOrderModel();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.orderModel.orderId = this.OrderId;
      this.adminService.UpdateOrder(this.orderModel).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.resetOrderModel();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }
}
