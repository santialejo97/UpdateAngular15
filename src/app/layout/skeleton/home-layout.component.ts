import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-home-layout',
  template: `
  
  <app-breadcrumb></app-breadcrumb>
  <a (click)="logout()" style="text-align: right; float: right; color: #004884;">Cerrar sesión &nbsp;&nbsp;&nbsp;&nbsp;</a>
  <app-datosusuario></app-datosusuario>
  <router-outlet></router-outlet>
 
  `,
  styles: []
})
export class HomeLayoutComponent {

  constructor(private accountService: AccountService) { }

  logout() {
    this.accountService.CerrarSesion();
  }
}
