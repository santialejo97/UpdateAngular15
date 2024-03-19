import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { IUsuario } from '../interfaces/IUsuario';
import { LoginModel } from '../models/Login.model';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  //user: LoginModel;
  user: IUsuario;
  
  constructor(
    private accountService: AccountService) {
      this.user = this.accountService.userValue;
    }

  public out() {
    this.accountService.CerrarSesion();
  }


  ngOnInit(): void {
    
  }

   
}
