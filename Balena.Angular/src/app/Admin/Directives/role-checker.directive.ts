import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';

@Directive({
  selector: '[appRoleChecker]'
})
export class RoleCheckerDirective implements OnInit {
  @Input() roles: string[];

  constructor(private ref: ElementRef<HTMLElement>, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.isInRole(this.roles))
      this.ref.nativeElement?.remove();
  }
}
