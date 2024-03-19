import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnularIncapacidadComponent } from './component/anular-incapacidad/anular-incapacidad.component';
import { ConceptoRehabilitacionComponent } from './component/concepto-rehabilitacion/concepto-rehabilitacion.component';
import { RegistrarIncapacidadComponent } from 'src/app/component/registrar-incapacidad/registrar-incapacidad.component';
import { OptionsComponent } from './layout/options/options.component';
import { AuthGuard } from './helpers';
import { ImprimirIncapacidadComponent } from './component/imprimir-incapacidad/imprimir-incapacidad.component';
import { HomeLayoutComponent } from './layout/skeleton/home-layout.component';
import { LoginLayoutComponent } from './layout/skeleton/login-layout.component';
import { ConsultarIncapacidadComponent } from './component/consultar-incapacidad/consultar-incapacidad.component';
import { pagoIncapacidadComponent } from './component/pago-incapacidad/pago-incapacidad.component';
import { ActualizacionDatosComponent } from './component/actualizacion-datos/actualizacion-datos-contacto.component';
import { PerdidaCapacidadLaboralComponent } from './component/perdida-capacidad-laboral/perdida-capacidad-laboral.component';


const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [

  //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
  //{ path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  //{ path: 'home', component: InicioComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Inicio' } },

  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'account', loadChildren: accountModule },
         ]
  },

  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'incapacidades', data: { breadcrumb: 'Incapacidades' }, children: [
          { path: 'registrar-incapacidad', component: RegistrarIncapacidadComponent, data: { breadcrumb: 'Registrar Incapacidad' } },
          { path: 'registrar-incapacidad/:idIncapacidad', component: RegistrarIncapacidadComponent, data: { breadcrumb: 'Registrar incapacidad' } },
          { path: 'anular-incapacidad', component: AnularIncapacidadComponent, data: { breadcrumb: 'Anular Incapacidad' } },
          { path: 'concepto-rehabilitacion', component: ConceptoRehabilitacionComponent, data: { breadcrumb: 'Concepto Rehabilitacion' } },
          { path: 'imprimir-incapacidad', component: ImprimirIncapacidadComponent, data: { breadcrumb: 'Imprimir incapacidad' } },
          { path: 'consultar-incapacidad', component: ConsultarIncapacidadComponent, data: { breadcrumb: 'consultar incapacidad' } },
          { path: 'pago-incapacidad', component: pagoIncapacidadComponent, data: { breadcrumb: 'Pago incapacidad' } },
          { path: 'actualizacion-datos', component: ActualizacionDatosComponent, data: { breadcrumb: 'Actualización de datos' } },
          { path: 'pcl-incapacidad', component: PerdidaCapacidadLaboralComponent, data: { breadcrumb: 'Pérdida Capacidad Laboral' } },

          { path: '**', redirectTo: '/menu-principal' }
        ]
      },
    ]
  },

  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { //{ path: 'menu-principal', component: OptionsComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Menu Principal' } },
        path: 'menu-principal', component: OptionsComponent, data: { breadcrumb: 'Menu Principal' }
        
      },
      { path: '**', redirectTo: '/account/login' }
    ]
  },
  { path: '**', redirectTo: '/menu-principal' },
  { path: '', redirectTo: '/account/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
