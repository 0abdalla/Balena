import { NgFor, NgForOf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
UsersData: any[] = [];
  Roles = [
    { nameEn: 'SupperAdmin', nameAr: 'مدير' },
    { nameEn: 'WebSite', nameAr: 'موقع زائر الخير' },
    { nameEn: 'Services', nameAr: 'خدمات اجتماعية' },
    { nameEn: 'BeneFactors', nameAr: 'متبرعين' },
    { nameEn: 'Accounts', nameAr: 'حسابات' },
    { nameEn: 'Admin', nameAr: 'مشرف' }
  ];
  StatisticsData: any;
  TotalCount = 0;

  constructor() {

  }

  ngOnInit(): void {
    // this.GetStatisticsHome();
    // this.GetAllUsers();
  }

  // GetStatisticsHome() {
  //   this.adminService.GetStatisticsHome().subscribe(data => {
  //     this.StatisticsData = data;
  //   })
  // }

  // GetAllUsers() {
  //   this.adminService.GetAllUsers().subscribe(data => {
  //     this.UsersData = data.filter(i => i.isActive);
  //     this.UsersData.forEach(item => {
  //       let role = this.Roles.find(i => i.nameEn == item.role);
  //       if (role)
  //         item.role = role.nameAr;
  //     });
  //     this.TotalCount = this.UsersData.length;
  //   })
  // }
}
