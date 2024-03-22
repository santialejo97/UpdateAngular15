import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { AlertasService } from 'src/app/services/alertas.service';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { UsuarioFuncionesService } from 'src/app/services/usuario-funciones.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incapacidad-contingencia',
  templateUrl: './incapacidad-contingencia.component.html',
  styleUrls: ['./incapacidad-contingencia.component.scss'],
})
export class IncapacidadContingenciaComponent implements OnInit {
  private stepper!: Stepper;
  fechaExpedicionForm: FormGroup;
  profesionalForm: FormGroup;
  perfilUbicacion!: IPerfilComple;
  submittedFechaForm!: boolean;
  submittedProfesionalForm!: boolean;
  fechaHoy: number = Date.now();
  listaTipoDocumento: any;
  idPlanContingenciaLink!: number;
  consultaPlanContingenciaActual: any;

  private _cryptoService: CryptoService;
  private _accountService: AccountService;

  constructor(
    private formBuilder: FormBuilder,
    private parametrosIncapacidadesService: ParametrosIncapacidadesService,
    private usuarioFuncionesService: UsuarioFuncionesService,
    private Alertas: AlertasService,
    cryptoService: CryptoService,
    accountService: AccountService
  ) {
    this._accountService = accountService;
    this._cryptoService = cryptoService;

    this.fechaExpedicionForm = this.formBuilder.group({
      fechaExpedicion: ['', Validators.required],
    });

    this.profesionalForm = this.formBuilder.group({
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', Validators.required],
    });
  }

  get f_fechaExpedicion() {
    return this.fechaExpedicionForm.controls;
  }

  get f_profesional() {
    return this.profesionalForm.controls;
  }

  async ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1')!, {
      linear: true,
      animation: true,
    });

    this.perfilUbicacion =
      JSON.parse(localStorage.getItem('complementario2')!) || '';

    this.consultaPlanContingenciaActual =
      await this.consultarPlanContingenciaEnEjecucion();

    this.Alertas.alertaInformativa(
      '',
      'Solo se debe hacer uso de esta funcionalidad si se realizó una incapacidad en SIPE local offline por contingencia',
      'Cerrar'
    );

    this.cargarListas();
  }

  // async consultarPlanContingenciaExistente() {
  //   let valuesParam = {
  //     id_entidad: this.perfilUbicacion.idEntidad,
  //   };

  //   await this.parametrosIncapacidadesService.postIncapacidad('/Incapacidad/ConsultaPlanContingencia', valuesParam);
  //   console.log(this.consultaPlanContingenciaActual)
  //   return this.consultaPlanContingenciaActual;
  // }

  async consultarPlanContingenciaEnEjecucion() {
    let valuesParam = {
      fecha_registro:
        this.fechaExpedicionForm.get('fechaExpedicion')?.value == ''
          ? null
          : this.fechaExpedicionForm.get('fechaExpedicion')?.value,
      id_entidad: this.perfilUbicacion.idEntidad,
    };
    const result = await this.parametrosIncapacidadesService.postIncapacidad(
      '/Incapacidad/ConsultaPlanContingencia',
      valuesParam
    );
    console.log(result);
    return result;
  }

  async cargarListas() {
    this.listaTipoDocumento = await this.parametrosIncapacidadesService.get(
      '/tipodocumento'
    );
    console.log('listaTipoDocumento cargada con exito');
  }

  async onSubmitFechaForm() {
    this.submittedFechaForm = true;
    if (this.fechaExpedicionForm.valid) {
      const consultaPlanContingenciaEjecucion =
        await this.consultarPlanContingenciaEnEjecucion();
      console.log(consultaPlanContingenciaEjecucion);

      if (consultaPlanContingenciaEjecucion == null) {
        this.Alertas.alertaInformativa(
          '',
          'La entidad no presenta registro de plan de contingencia activo',
          'Cerrar'
        );
      } else {
        this.idPlanContingenciaLink = consultaPlanContingenciaEjecucion.id;
        this.next();
      }
    }
  }

  async onSubmitProfesionalForm() {
    this.submittedProfesionalForm = true;
    if (this.profesionalForm.valid) {
      const usuarioEncontrado = await this.usuarioFuncionesService.post(
        'ConsultarUsuarioPorDocumento',
        {
          tipoDocumento: this.profesionalForm.get('tipoDocumento')?.value,
          numeroDocumento: this.profesionalForm.get('numeroDocumento')?.value,
          idEntidad: this.perfilUbicacion.idEntidad,
        }
      );
      if (usuarioEncontrado != null) {
        await this.Alertas.alertaInformativa(
          '',
          'Profesional de la salud Verificado Correctamente',
          'Cerrar'
        );
        this.next();
      } else {
        await this.Alertas.alertaInformativa(
          '',
          'Profesional en la salud no tiene permisos o no se encontró',
          'Cerrar'
        );
        return;
      }
    }
  }

  next() {
    this.stepper.next();
  }

  nextTo(value: any) {
    this.stepper.to(value);
  }

  goBack() {
    this.stepper.previous();
  }

  expedirIncapacidadContingencia() {
    console.log('route');

    let fechaValida = new Date(Date.now());
    fechaValida.setMinutes(
      fechaValida.getMinutes() + environment.TiempoDeValidezLinkEnMinutos
    );

    let mensajeRegistrarIncapacidad = {
      id: '0',
      idPlanContingencia: this.idPlanContingenciaLink,
      fechaExpedicionForm:
        this.fechaExpedicionForm.get('fechaExpedicion')?.value,
      fechaValidacion: fechaValida,
      idUsuarioEntidadRol: this.perfilUbicacion.idUsuarioEntidadRol,
    };

    const secretKey = this._accountService.userValue!.access_token.substring(
      0,
      16
    );
    const hash = this._cryptoService.getHash(
      mensajeRegistrarIncapacidad,
      secretKey
    );

    console.log('incapacidades/registrar-incapacidad/' + hash);
    location.href = 'incapacidades/registrar-incapacidad/' + hash;

    //const res2 =this._cryptoService.getEncriptMessage(hash,secretKey);
    //console.log(res2)

    //console.log('incapacidades/registrar-incapacidad/0/' + this.f_fechaExpedicion.fechaExpedicion.value + '/' + this.perfilUbicacion.idUsuarioEntidadRol)
    //location.href = 'incapacidades/registrar-incapacidad/null/' + this.fechaExpedicionForm.controls['fechaExpedicion'].value + '/' + this.perfilUbicacion.idUsuarioEntidadRol;
  }
}
