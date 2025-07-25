import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css'
})
export class NotAuthorizedComponent {
  UserModel: any;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
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
