import { Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Auth/auth.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-header',
  imports: [FormsModule, NgFor, NgbDropdownModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @ViewChildren('autoCompleteText') autoCompleteTextRefs: QueryList<ElementRef>;
  @ViewChild("autoCompleteWrapper") autoCompleteWrapper: ElementRef;
  @Output() collapseExpandContent = new EventEmitter<boolean>();
  @Input() isCollapseOrExpand = false;
  PagesList: any[] = [];
  SearchText = '';
  isCollapseExpandContent = false;
  isSearchOpen = false;
  collapsed = true;
  showAutoCompleteMenu = false;
  UserModel: any;


  constructor(private router: Router, private authService: AuthService) {
    this.onClickOutside;
  }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    // this.GetPagesAutoSearch();
  }

  HandleSearchEle(index: number, inputEle: any) {
    this.showAutoCompleteMenu = false;
    inputEle.value = this.autoCompleteTextRefs.toArray()[index].nativeElement.textContent;
  }

  onCollapseExpandMenu() {
    this.collapseExpandContent.emit();
  }

  // GetPagesAutoSearch() {
  //   this.adminService.GetPagesAutoSearch(this.SearchText).subscribe(data => {
  //     this.PagesList = data;
  //   });
  // }

  onShowAutoCompleteMenu(input: HTMLInputElement) {
    this.showAutoCompleteMenu = true;
    if (input.value === '') {
      this.showAutoCompleteMenu = false;
    }

    // this.GetPagesAutoSearch();
  }

  goToWebsite() {
    this.authService.AdminLogout(this.UserModel?.userId).subscribe(data => {
      if (data) {
        localStorage.removeItem('UserModel');
        this.router.navigateByUrl('/');
      }
    });
  }

  @HostListener('document:mousedown', ['$event']) onClickOutside(event: Event) {
    if (!this.autoCompleteWrapper?.nativeElement?.contains(event.target)) {
      this.showAutoCompleteMenu = false;
      this.isSearchOpen = false;
    } else {
      return;
    }
  }

  Logout() {
    this.authService.AdminLogout(this.UserModel?.userId).subscribe(data => {
      if (data) {
        localStorage.removeItem('UserModel');
        this.router.navigateByUrl('/login');
      }
    });
  }
}
