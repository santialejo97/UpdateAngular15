import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { NotificationesService } from '../services/notificaciones.service';
import { ValidarUsuarioService } from '../services/validar-usuario.service';
import { ILogin } from '../interfaces/ILogin';
import { IRetornoUsuario } from '../interfaces/IRetornoUsuario';
import { CaptchaComponent } from './captcha/captcha.component';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from '../services/configuraciones.service';



@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  arreglo: any[];
  rutaReaginacionClave: string;
  catchaValido = false;
  banderacaptcha: boolean;

  @ViewChild(CaptchaComponent) capcha: CaptchaComponent;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: NotificationesService,
    private validarUsuarioService: ValidarUsuarioService,
    private configuracionesService: ConfiguracionesService
  ) {  console.log('entro log login', this.configuracionesService.captchaBand); }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Aplicacion: ['Incapacidades'],
      NombreUsuario: ['', Validators.required],
      Contrasena: ['', Validators.required],
      Ip: ['192.168.38.11']
    });

    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = '/account/perfil';
    this.rutaReaginacionClave = environment.recuperarContraseña;
    this.banderacaptcha = environment.captchaBand;
    //this.banderaCat = configuracionService.captchaBand;
  }

  get f() { return this.form.controls; }

  onSubmit(datosUsuario: ILogin) {
    this.submitted = true;

    //this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.banderacaptcha == true) {

        this.catchaValido = this.capcha.retornoLogin;

        if (this.catchaValido == true) {

          this.validarUsuarioLogin(datosUsuario);
          // //this.validarUsuarioService.AutenticarUsuario(datosUsuario).subscribe(data => { console.log(data) });
          // this.validarUsuarioService.AutenticarUsuario(datosUsuario)
          //   .subscribe(data => {
          //     //this.arreglo = JSON.parse(JSON.stringify(data));
          //     const cs: IRetornoUsuario = this.arreglo = JSON.parse(JSON.stringify(data));
          //     //let index = (this.arreglo.findIndex(i => i.nombreUsuario === datosUsuario.nombreUsuario) > -1) console.log("Usuario encontrado") : console.log("Usuario no encontrado");
          //     //const result = Array.isArray(this.arreglo) ? this.arreglo.findIndex(element => element.nombreUsuario === datosUsuario.nombreUsuario) : -1;

          //     //this.accountService.IniciarSesion(this.f.NombreUsuario.value, this.f.Contrasena.value, cs.datosUsuario)
          //     this.accountService.IniciarSesion(cs.datosUsuario, cs.datosRol)
          //       .pipe(first())
          //       .subscribe(
          //         data => {
          //           this.router.navigate([this.returnUrl]);
          //           //this.router.navigate(['/incapacidades']);
          //           //localStorage.setItem('perfil', JSON.stringify(cs.datosPerfil));
          //         },
          //         error => {
          //           this.alertService.showError(error, "");
          //           this.loading = false;
          //         });
          //   });
        }

        else {
          this.alertService.showError("Captcha Inválido", "Favor habilitar captcha");
          this.loading = false;
          }
        }

    else {
      this.validarUsuarioLogin(datosUsuario);
    }
    
  }

  validarUsuarioLogin(datosUsuario: ILogin){
    this.validarUsuarioService.AutenticarUsuario(datosUsuario)
        .subscribe(data => {
          
          const cs: IRetornoUsuario = this.arreglo = JSON.parse(JSON.stringify(data));
          if(cs.codigo){
            this.alertService.showError("Error en servicio", "Revisar conexión con servicios externos.");
            this.loading = false;
            return;
          }

          if(cs.loginUsuario.NombreUsuario){
            this.accountService.IniciarSesion(cs.datosUsuario, cs.datosRol)
              .pipe(first())
              .subscribe(
                data => {
                  this.router.navigate([this.returnUrl]);
                },
                error => {
                  //this.alertService.showError(error, "");
                  //this.alertService.showError("Error en servicio", "Revisar conexión con servicios externos");
                  console.log(error);
                  this.loading = false;
                });
            }else{
              this.alertService.showError("Autenticación", "Los datos de usuario no corresponden");
              console.log('Los datos de usuario no coinciden');
              this.loading = false;
            }
        },
        error => {
          //this.alertService.showError(error, "");
          this.alertService.showError("Error en servicio", "Error en conexión");
          console.log(error);
          this.loading = false;
        });
  }
    
}

