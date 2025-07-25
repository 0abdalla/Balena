import { Component, TemplateRef } from '@angular/core';
import { AdminHeaderComponent } from "../Shared/admin-header/admin-header.component";
import { AdminSideMenuComponent } from "../Shared/admin-side-menu/admin-side-menu.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminHeaderComponent, AdminSideMenuComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isCollapseExpand = false;
  isFilter = false;

  constructor(private modalService: NgbModal) { }

  openAddItemModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      size: 'xl',
      scrollable: true,
      centered: true
    })
  }
}
