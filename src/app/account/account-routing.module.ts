import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaptchaComponent } from './captcha/captcha.component';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { PerfilComponent } from './perfil/perfil.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'perfil', component: PerfilComponent },
          { path: 'captcha', component: CaptchaComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
