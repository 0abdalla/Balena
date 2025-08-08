import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
UsersData: any[] = [];
  Roles = [
    { nameEn: 'SupperAdmin', nameAr: 'مدير' },
    { nameEn: 'Admin', nameAr: 'موظف' }
  ];
  StatisticsData: any;
  TotalCount = 0;

  constructor(private adminService:AdminService) {

  }

  ngOnInit(): void {
    this.GetStatisticsHome();
    this.GetAllUsers();
  }

  GetStatisticsHome() {
    this.adminService.GetStatisticsHome().subscribe(data => {
      this.StatisticsData = data;
    })
  }

  GetAllUsers() {
    this.adminService.GetAllUsers().subscribe(data => {
      this.UsersData = data.results.filter(i => i.isActive);
      this.UsersData.forEach(item => {
        let role = this.Roles.find(i => i.nameEn == item.role);
        if (role)
          item.role = role.nameAr;
      });
      this.TotalCount = this.UsersData.length;
    })
  }
}
