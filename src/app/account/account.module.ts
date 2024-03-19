import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
/*import { BrowserModule } from "@angular/platform-browser";*/

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CaptchaComponent } from './captcha/captcha.component';


@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      AccountRoutingModule,
      FormsModule,
      RecaptchaFormsModule,
      RecaptchaModule
  
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        PerfilComponent,
        CaptchaComponent
  ],
  bootstrap: [LoginComponent,
    PerfilComponent,
    CaptchaComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class AccountModule { }
