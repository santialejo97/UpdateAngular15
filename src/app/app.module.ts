
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './layout/footer/footer.component';

import { RegistrarIncapacidadComponent } from './component/registrar-incapacidad/registrar-incapacidad.component';
import { HelloComponent } from './component/registrar-incapacidad/hello.component';
import { AnularIncapacidadComponent } from './component/anular-incapacidad/anular-incapacidad.component';
import { ConceptoRehabilitacionComponent } from './component/concepto-rehabilitacion/concepto-rehabilitacion.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { DatosusuarioComponent } from './layout/datosusuario/datosusuario.component';
import { OptionsComponent } from './layout/options/options.component';
import { InicioComponent } from './component/inicio/inicio.component';
import { HeaderComponent } from './layout/header/header.component';

import { ModalListaDiagnosticoComponent } from './component/registrar-incapacidad/modal-lista-diagnostico/modal-lista-diagnostico.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';

import { ParametrosIncapacidadesService } from './services/parametros-incapacidades.service';
import { NotificationesService } from './services/notificaciones.service';

import { ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from './helpers';
import { InformacionIncapacidadComponent } from './component/registrar-incapacidad/informacion-incapacidad/informacion-incapacidad.component';
import { EditarPacienteComponent } from './component/editar-paciente/editar-paciente.component';
import { ModalAlertaComponent } from './component/utilidades/modal-alerta/modal-alerta.component';
import { ModalConfirmacionComponent } from './component/registrar-incapacidad/modal-confirmacion/modal-confirmacion.component';
import { ModalIncapacidadAnteriorComponent } from './component/registrar-incapacidad/modal-incapacidad-anterior/modal-incapacidad-anterior.component';
import { ServiciosIntegracionService } from './services/servicios-integracion.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GlobalErrorHandler } from './component/utilidades/global-error-handler';
import { ModalConfirmacionPacienteComponent } from './component/editar-paciente/modal-confirmacion-paciente/modal-confirmacion-paciente.component';
import { ModalDetalleIncapacidadCRComponent } from './component/concepto-rehabilitacion/modal-incapacidad/modal-detalle-incapacidad.component';
import { InformacionPacienteComponent } from './component/editar-paciente/informacion-paciente/informacion-paciente.component';
import { ModalListaIncapacidadesAnterioresComponent } from './component/registrar-incapacidad/modal-lista-incapacidades-anteriores/modal-lista-incapacidades-anteriores.component';
import { ModalAportantesComponent } from './component/registrar-incapacidad/modal-aportantes/modal-aportantes.component';
import { ModalAportantesPagoComponent } from './component/pago-incapacidad/modal-aportantes-pago/modal-aportantes-pago.component';
import { ImprimirIncapacidadComponent } from './component/imprimir-incapacidad/imprimir-incapacidad.component';
import { ListaIncapacidadesComponent } from './component/imprimir-incapacidad/lista-incapacidades/lista-incapacidades.component';
import { HomeLayoutComponent } from './layout/skeleton/home-layout.component';
import { LoginLayoutComponent } from './layout/skeleton/login-layout.component';

import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
  
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { ConsultarIncapacidadComponent } from './component/consultar-incapacidad/consultar-incapacidad.component';
import { ModalConfirmarComponent } from './component/consultar-incapacidad/modal-confirmar/modal-confirmar.component';
import { IncapacidadInformacionComponent } from './component/consultar-incapacidad/incapacidad-informacion/incapacidad-informacion.component';
import { RegistrarPrestacionComponent } from './component/consultar-incapacidad/registrar-prestacion/registrar-prestacion.component'
import { pagoIncapacidadComponent } from './component/pago-incapacidad/pago-incapacidad.component';
import { listaPagoIncapacidadesComponent } from './component/pago-incapacidad/lista-incapacidades/lista-pago-incapacidades.component';
import { InformacionPagoComponent } from './component/pago-incapacidad/informacion-pago/informacion-pago.component';
import { ActualizacionDatosComponent } from './component/actualizacion-datos/actualizacion-datos-contacto.component';
import { PerdidaCapacidadLaboralComponent } from './component/perdida-capacidad-laboral/perdida-capacidad-laboral.component';

import { ModalConfirmacionPCLComponent } from './component/perdida-capacidad-laboral/modal-confirmacion-pcl/modal-confirmacion-pcl.component';
import { InformacionIncapacidadPCLComponent } from './component/perdida-capacidad-laboral/informacion-incapacidad-pcl/informacion-incapacidad-pcl.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    FooterComponent,
    RegistrarIncapacidadComponent,
    HelloComponent,
    AnularIncapacidadComponent,
    ConceptoRehabilitacionComponent,
    BreadcrumbComponent,
    DatosusuarioComponent,
    OptionsComponent,
    InicioComponent,
    HeaderComponent,
    ModalListaDiagnosticoComponent,
    ModalConfirmacionComponent,
    ModalAlertaComponent,
    InformacionIncapacidadComponent,
    EditarPacienteComponent,
    ModalIncapacidadAnteriorComponent,
    ModalConfirmacionPacienteComponent,
    ModalDetalleIncapacidadCRComponent,
    InformacionPacienteComponent,
    ModalListaIncapacidadesAnterioresComponent,
    ModalAportantesComponent,
    ModalAportantesPagoComponent,
    ImprimirIncapacidadComponent,
    ListaIncapacidadesComponent,
    ConsultarIncapacidadComponent,
    ModalConfirmarComponent,
    IncapacidadInformacionComponent,
    RegistrarPrestacionComponent,
    pagoIncapacidadComponent,
    listaPagoIncapacidadesComponent,
    InformacionPagoComponent,
    ActualizacionDatosComponent,
    PerdidaCapacidadLaboralComponent,
    ModalConfirmacionPCLComponent,
    InformacionIncapacidadPCLComponent
    
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, 
    //AngularFormsInputMasksModule, 
    RouterModule, AppRoutingModule, BrowserAnimationsModule , NgbModule, ReactiveFormsModule,
    AutocompleteLibModule, ToastrModule.forRoot(), NgxSpinnerModule,
    MatDatepickerModule, MatNativeDateModule,
    MatInputModule, 
    //NgxMaskModule.forRoot(maskConfig)
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideEnvironmentNgxMask(maskConfig),//NgxMaskModule.forRoot(maskConfig)
   
    ParametrosIncapacidadesService,
    NotificationesService,
    ServiciosIntegracionService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    //{ provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
