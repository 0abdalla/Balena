import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-side-menu',
  imports: [NgbCollapseModule,RouterLink],
  templateUrl: './admin-side-menu.component.html',
  styleUrl: './admin-side-menu.component.css'
})
export class AdminSideMenuComponent implements OnInit {
  @Input() isCollapsing = false;
  @Output() closeSideMenuFromOverlayEvent = new EventEmitter<boolean>();
  isCollapsed_1 = true;
  isCollapsed_2 = true;
  isCollapsed_3 = true;
  isCollapsed_4 = true;
  RoleName = '';
  UserModel: any;
  Roles = [
    { nameEn: 'SupperAdmin', nameAr: 'مدير' },
    { nameEn: 'WebSite', nameAr: 'موقع زائر الخير' },
    { nameEn: 'Services', nameAr: 'خدمات اجتماعية' },
    { nameEn: 'BeneFactors', nameAr: 'متبرعين' },
    { nameEn: 'Accounts', nameAr: 'حسابات' },
    { nameEn: 'Admin', nameAr: 'مشرف' }
  ];
  WebSite = ['home-slideimage', 'activity', 'event', 'photo'];
  BeneFactor = ['benefactors', 'benefactor-detail', 'benefactor-type', 'benefactor-note', 'benefactor-nationality'];
  Tasks = ['account-export-money', 'account-import-money', 'general-tasks', 'daily-tasks'];
  Services = ['family-status', 'family-nationality', 'family-needs', 'family-categories', 'family-patientTypes'];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.RoleName = this.Roles.find(i => i.nameEn == this.UserModel?.role)?.nameAr;
    let url = this.router.url.split('/')[2];
    if (this.WebSite.includes(url))
      this.isCollapsed_1 = false;
    else if (this.BeneFactor.includes(url))
      this.isCollapsed_3 = false;
    else if (this.Tasks.includes(url))
      this.isCollapsed_4 = false;
    else if (this.Services.includes(url))
      this.isCollapsed_2 = false;
  }

  onCloseSidemenuFromOverlay() {
    this.closeSideMenuFromOverlayEvent.emit();
  }
}
