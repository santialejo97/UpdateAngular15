import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Stepper from 'bs-stepper';
// import * as incapacidadModel from 'src/app/Models/incapacidad.model';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms'; //listaDocumento
import { Observable } from 'rxjs'; //listaDocumento
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IPerfil } from 'src/app/interfaces/IPerfil';
/*import { ModalConfirmacionComponent } from './modal-confirmacion/modal-confirmacion.component';*/
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { CryptoService } from 'src/app/services/crypto.service';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-anular-incapacidad',
  templateUrl: './anular-incapacidad.component.html',
  styleUrls: ['./anular-incapacidad.component.scss'],
})
export class AnularIncapacidadComponent implements OnInit {
  listaTipoDocumento: any;
  listaCausaAnulacion: any;
  paciente: any;
  mensajeModalCuerpo = '';
  incapacidadVerificada = true;
  parametrosIncapacidadesService: ParametrosIncapacidadesService;
  options: any[] = [];
  listaMensajeModal: any[] = [];
  optionsSelected: any[] = [];
  submittedAnulacion = false;
  incapacidadAnulada: any;
  incapacidadAnuladaId!: number;
  submittedIncapacidad = false;
  numeroIncapacidad: any;
  perfilUbicacion: any;
  idEntidad: any;
  formConsultaIncapacidad: FormGroup;
  formAnularIncapacidad: FormGroup;

  optionModalidadIntramural: any;
  optionRetroActivaSi: any;
  /*  mensajeAnulacion: string;*/

  optionsModal: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    backdropClass: 'light-blue-backdrop',
    windowClass: 'dark-modal',
    centered: true,
  };
  private _accountService: AccountService;
  private _cryptoService: CryptoService;
  consultaPlanContingenciaActual: any;

  constructor(
    private fb: FormBuilder,
    private parametrosIncapacidadesServiceIn: ParametrosIncapacidadesService,
    private modal: NgbModal,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    cryptoService: CryptoService,
    accountService: AccountService,
    private Alertas: AlertasService
  ) {
    this.parametrosIncapacidadesService = parametrosIncapacidadesServiceIn;

    this.formConsultaIncapacidad = this.fb.group({
      numeroIncapacidad: ['', Validators.required],
      tipoDocumentoId: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
    });

    this.formAnularIncapacidad = this.fb.group({
      causaAnulacion: ['', Validators.required],
      observaciones: ['', Validators.required],
      campos: [''],
    });

    this.paciente = {
      primerNombre: '',
      SegundoNombre: '',
      primerApellido: '',
      SegundoApellido: '',
      numeroIncapacidad: '',
      tipoDocumento: '',
      numeroDocumento: '',
    };
    console.log(this.paciente);

    this._accountService = accountService;
    this._cryptoService = cryptoService;
  }

  private stepper!: Stepper;

  ngOnInit() {
    let elementDiv: Element = document.querySelector('#stepper1')!;
    this.stepper = new Stepper(elementDiv, {
      linear: false,
      animation: true,
    });

    this.cargarListas();
  }

  next() {
    this.stepper.next();
  }

  get f_persona() {
    return this.formConsultaIncapacidad.controls;
  }
  get f_anulacion() {
    return this.formAnularIncapacidad.controls;
  }

  async buscarIncapacidad(contenidoIncapacidad: any) {
    try {
      this.spinnerService.show('spinnerCargaAnulacion');
      this.submittedIncapacidad = true;
      // stop here if form is invalid
      if (this.formConsultaIncapacidad.invalid) {
        this.spinnerService.hide('spinnerCargaAnulacion');
        return;
      }

      const incapacidad: any = {
        numeroIncapacidad:
          this.formConsultaIncapacidad.get('numeroIncapacidad')?.value,
        tipoDocumentoId:
          this.formConsultaIncapacidad.get('tipoDocumentoId')?.value,
        numeroDocumento:
          this.formConsultaIncapacidad.get('numeroDocumento')?.value,
      };

      let resultIncapacidad =
        await this.parametrosIncapacidadesService.getIncapacidad(
          '/Incapacidad/' +
            incapacidad.numeroIncapacidad +
            '/' +
            incapacidad.tipoDocumentoId +
            '/' +
            incapacidad.numeroDocumento
        );
      console.log(resultIncapacidad);
      this.validarIncapacidad(
        contenidoIncapacidad,
        resultIncapacidad,
        incapacidad
      );
      this.spinnerService.hide('spinnerCargaAnulacion');
    } catch {
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
  }

  async validarIncapacidad(
    contenidoIncapacidad: any,
    contenidoIncapacidadDetalle: any,
    incapacidad: any
  ) {
    console.log(contenidoIncapacidad);
    console.log(contenidoIncapacidadDetalle);
    console.log(incapacidad);
    this.numeroIncapacidad = incapacidad.numeroIncapacidad;

    if (contenidoIncapacidadDetalle == null) {
      this.mensajeModalCuerpo =
        'El número de incapacidad: ' +
        incapacidad.numeroIncapacidad +
        ' asociada al paciente con número de documento: ' +
        incapacidad.numeroDocumento +
        ' NO existe';
      this.incapacidadVerificada = false;
      console.log('no existe');
      this.listaMensajeModal = [];
      this.openModalMensaje(contenidoIncapacidad);
    } else {
      this.incapacidadVerificada = true;
      this.listaMensajeModal = [];

      const fechaActual = new Date();
      let fechaExpedicionMas48horas = new Date(
        contenidoIncapacidadDetalle.fecha_expedicion_string
      );

      const numberOfMlSeconds = fechaExpedicionMas48horas.getTime();
      const addMlSeconds = 48 * 60 * 60000;

      fechaExpedicionMas48horas = new Date(numberOfMlSeconds + addMlSeconds);

      console.log(
        'fecha Expedicion Mas 48 horas' +
          this.getFormattedDate(fechaExpedicionMas48horas)
      );
      console.log('fecha actual' + this.getFormattedDate(fechaActual));

      console.log(this.idEntidad);
      console.log(contenidoIncapacidadDetalle.id_entidad);

      if (
        contenidoIncapacidadDetalle.pagada == true ||
        contenidoIncapacidadDetalle.anulada == true ||
        fechaExpedicionMas48horas < fechaActual ||
        this.idEntidad != contenidoIncapacidadDetalle.id_entidad
      ) {
        this.mensajeModalCuerpo =
          'No se puede anular la incapacidad ' +
          incapacidad.numeroIncapacidad +
          ' porque:';

        contenidoIncapacidadDetalle.pagada == true
          ? this.listaMensajeModal.push(
              'Esta incapacidad no puede ser Anulada, debido a que tiene registrado pago'
            )
          : null;
        contenidoIncapacidadDetalle.anulada == true
          ? this.listaMensajeModal.push('Esta incapacidad ya fue anulada')
          : null;
        fechaExpedicionMas48horas < fechaActual
          ? this.listaMensajeModal.push(
              'La fecha de expedición de la incapacidad supera dos días de expedida'
            )
          : null;
        this.idEntidad != contenidoIncapacidadDetalle.id_entidad
          ? this.listaMensajeModal.push(
              'La entidad desde donde se está anulando es diferente a la entidad de expedición'
            )
          : null;

        this.incapacidadVerificada = false;
      }

      if (this.incapacidadVerificada == false) {
        this.openModalMensaje(contenidoIncapacidad);
      } else {
        this.formConsultaIncapacidad.reset();
        this.setDatosIncapacidad(contenidoIncapacidadDetalle);
      }
    }
  }

  public getFormattedDate(date: Date): string {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return (
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    );
  }

  setDatosIncapacidad(resultIncapacidad: any) {
    this.next();

    this.options = [
      {
        nombreColumna: 'grupoServiciosId',
        desc: 'Grupo Servicios',
        valorColumna: resultIncapacidad.grupoServicios.descripcion,
        idColumna: resultIncapacidad.grupoServicios.id_servicio,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'Modalidad',
        desc: 'Modalidad',
        valorColumna: resultIncapacidad.modalidad.descripcion,
        idColumna: resultIncapacidad.modalidad.id_modalidad,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'Origen',
        desc: 'Origen',
        valorColumna: resultIncapacidad.origen.descripcion,
        idColumna: resultIncapacidad.origen.id_origen,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'CausaAtencion',
        desc: 'Causa Atencion',
        valorColumna: resultIncapacidad.causaAtencion.descripcion,
        idColumna: resultIncapacidad.causaAtencion.id_causa,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'Diagnostico',
        desc: 'Diagnostico',
        valorColumna: resultIncapacidad.diagnostico.descripcion,
        idColumna: resultIncapacidad.diagnostico.cod_diagnostico,
        checked: false,
        disabled: false,
      },
      resultIncapacidad.diagnosticoRelacionUno != null
        ? {
            nombreColumna: 'DiagnosticoRealacionUno',
            desc: 'Diagnostico Relacion Uno',
            valorColumna: resultIncapacidad.diagnosticoRelacionUno.descripcion,
            idColumna:
              resultIncapacidad.diagnosticoRelacionUno.cod_diag_relacion_uno,
            checked: false,
            disabled: false,
          }
        : null,
      resultIncapacidad.diagnosticoRelacionDos != null
        ? {
            nombreColumna: 'DiagnosticoRealacionDos',
            desc: 'Diagnostico Relacion Dos',
            valorColumna: resultIncapacidad.diagnosticoRelacionDos.descripcion,
            idColumna:
              resultIncapacidad.diagnosticoRelacionDos.cod_diag_relacion_dos,
            checked: false,
            disabled: false,
          }
        : null,
      {
        nombreColumna: 'Prorroga',
        desc: 'Prorroga',
        valorColumna: resultIncapacidad.prorroga == true ? 'Sí' : 'No',
        idColumna: resultIncapacidad.prorroga,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'DiasIncapacidad',
        desc: 'Dias Incapacidad',
        valorColumna: resultIncapacidad.dias_incapacidad,
        idColumna: resultIncapacidad.dias_incapacidad,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'Retroactiva',
        desc: 'Retroactiva',
        valorColumna: resultIncapacidad.retroactiva == true ? 'Sí' : 'No',
        idColumna: resultIncapacidad.retroactiva,
        checked: false,
        disabled: false,
      },
      {
        nombreColumna: 'FechaInicio',
        desc: 'Fecha Inicio',
        valorColumna: resultIncapacidad.fecha_inicio.substring(0, 10),
        idColumna: resultIncapacidad.fecha_inicio,
        checked: false,
        disabled: resultIncapacidad.retroactiva == true ? false : true,
      },
      {
        nombreColumna: 'FechaFin',
        desc: 'Fecha Fin',
        valorColumna: resultIncapacidad.fecha_fin.substring(0, 10),
        idColumna: resultIncapacidad.fecha_fin,
        checked: false,
        disabled: true,
      },
    ];

    this.options = this.options.filter((el) => el != null);
    this.options.filter(Boolean);

    this.paciente = {
      primerNombre: resultIncapacidad.primer_nombre_pac,
      segundoNombre: resultIncapacidad.segundo_nombre_pac,
      primerApellido: resultIncapacidad.primer_apellido_pac,
      segundoApellido: resultIncapacidad.segundo_apellido_pac,
      numeroIncapacidad: resultIncapacidad.id_incapacidad,
      tipoDocumento: resultIncapacidad.tipoDocumento.descripcion,
      numeroDocumento: resultIncapacidad.numero_documento_pac,
    };

    //this.optionModalidadFilter = this.options.filter(
    //  el => (el.nombreColumna == "Modalidad" && el.valorColumna == "Intramural"))

    this.optionModalidadIntramural = this.FiltrarValor(
      'Modalidad',
      'Intramural'
    );

    this.optionRetroActivaSi = this.FiltrarId('Retroactiva', true);
  }

  FiltrarValor(NombreColumna: any, ValorColumna: any) {
    return this.options.filter(
      (el) =>
        el.nombreColumna == NombreColumna && el.valorColumna == ValorColumna
    );
  }

  FiltrarId(NombreColumna: any, Id: any) {
    return this.options.filter(
      (el) => el.nombreColumna == NombreColumna && el.id == Id
    );
  }

  SeleccionarInconsistencias() {
    this.next();
    this.optionsSelected = this.options;
    this.optionsSelected = this.selectedOptions;
    const newArray = this.optionsSelected.map(
      ({ checked, disabled, ...item }) => item
    );
    console.log(this.optionsSelected);
    console.log(newArray);
  }

  get selectedOptions() {
    return this.optionsSelected
      .filter((opt) => opt.checked)
      .map(({ checked, disabled, ...item }) => item);
  }

  openModalMensaje(contenidoIncapacidad: any) {
    this.modal.open(contenidoIncapacidad, { size: 'md' });
  }

  async anularIncapacidad() {
    this.modal.open({ size: 'md' });
  }

  async confirmarAnulacion() {
    try {
      this.consultaPlanContingenciaActual =
        await this.consultarPlanContingenciaExistente();
      if (this.consultaPlanContingenciaActual != null) {
        await this.Alertas.alertaInformativa(
          'Advertencia',
          'Existe un plan de contingencia activo, no se puede anular la incapacidad',
          'Cerrar'
        );
        return;
      }

      this.spinnerService.show('spinnerCargaAnulacion');

      const perfil: IPerfil =
        JSON.parse(localStorage.getItem('complementario') || '') || [];

      const incapacidad: any = {
        id_incapacidad: this.numeroIncapacidad,
        causa_anulacion:
          this.formAnularIncapacidad.get('causaAnulacion')?.value,
        observacion: this.formAnularIncapacidad.get('observaciones')?.value,
        campos_causa: JSON.stringify(this.optionsSelected),
        id_usuario_hercules: this.perfilUbicacion.idUsuarioEntidadRol,
        // id_usuario_hercules: 0,
      };

      console.log(incapacidad);

      await this.parametrosIncapacidadesService
        .setAnulacionIncapacidad('/Anulacion', incapacidad)
        .subscribe((data) => {
          this.incapacidadAnulada = data;
          this.incapacidadAnuladaId = data;
          this.incapacidadAnulada = this.incapacidadAnulada > 0 ? true : false;
          this.next();
        });

      this.modal.dismissAll();
      this.spinnerService.hide('spinnerCargaAnulacion');
    } catch {
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
  }

  openModalAnulacion(contenido: any) {
    this.submittedAnulacion = true;

    // stop here if form is invalid
    if (this.formAnularIncapacidad.invalid) {
      console.log('invva');
      return;
    }

    this.modal.open(contenido, { size: 'md' });
  }

  goBack() {
    this.stepper.previous();
  }

  finalizar() {
    location.href = 'incapacidades/anular-incapacidad';
  }

  onInputChange(cb: any) {
    console.log(cb);
    if (cb.target.id == 'Retroactiva' && cb.target.checked == true) {
      this.options.map(function (dato) {
        if (dato.nombreColumna == 'FechaInicio') {
          dato.disabled = false;
        }
        if (
          dato.nombreColumna == 'Modalidad' &&
          dato.valorColumna != 'Intramural' &&
          cb.target.value == 'false'
        ) {
          dato.disabled = true;
          dato.checked = true;
        }

        if (
          dato.nombreColumna == 'grupoServiciosId' &&
          dato.idColumna != 3 &&
          dato.idColumna != 5 &&
          cb.target.value == 'false'
        ) {
          dato.disabled = true;
          dato.checked = true;
        }
      });
    }

    if (cb.target.id == 'Retroactiva' && cb.target.checked == false) {
      this.options.map(function (dato) {
        if (dato.nombreColumna == 'FechaInicio') {
          dato.disabled = true;
          dato.checked = false;
        }
        if (
          dato.nombreColumna == 'Modalidad' &&
          dato.valorColumna != 'Intramural' &&
          cb.target.value == 'false'
        ) {
          dato.disabled = false;
          dato.checked = false;
        }
        if (
          dato.nombreColumna == 'grupoServiciosId' &&
          dato.idColumna != 3 &&
          dato.idColumna != 5 &&
          cb.target.value == 'false'
        ) {
          dato.disabled = false;
          dato.checked = false;
        }
      });
    }

    if (
      cb.target.id == 'Modalidad' &&
      cb.target.checked == true &&
      this.optionModalidadIntramural.length > 0
    ) {
      this.options.map(function (dato) {
        if (dato.nombreColumna == 'Retroactiva' && dato.idColumna == true) {
          dato.disabled = true;
          dato.checked = true;
        }
      });
    }

    if (
      cb.target.id == 'Modalidad' &&
      cb.target.checked == false &&
      this.optionModalidadIntramural.length > 0
    ) {
      this.options.map(function (dato) {
        if (dato.nombreColumna == 'Retroactiva' && dato.idColumna == true) {
          dato.disabled = false;
          dato.checked = false;
        }
      });
    }
  }

  reExpedir() {
    let fechaValida = new Date(Date.now());
    fechaValida.setMinutes(
      fechaValida.getMinutes() + environment.TiempoDeValidezLinkEnMinutos
    );

    let mensajeRegistrarIncapacidad = {
      id: this.numeroIncapacidad,
      id_incapacidad_anulado: this.incapacidadAnuladaId,
      fechaExpedicionForm: '',
      fechaValidacion: fechaValida,
      idUsuarioEntidadRol: this.perfilUbicacion.idUsuarioEntidadRol,
    };

    const secretKey = this._accountService!.userValue!.access_token.substring(
      0,
      16
    );
    const hash = this._cryptoService.getHash(
      mensajeRegistrarIncapacidad,
      secretKey
    );

    console.log('incapacidades/registrar-incapacidad/' + hash);
    location.href = 'incapacidades/registrar-incapacidad/' + hash; //location.href = 'incapacidades/registrar-incapacidad/' + this.numeroIncapacidad;
  }

  async cargarListas() {
    this.spinnerService.show('spinnerCargaInicial');

    this.listaTipoDocumento = await this.parametrosIncapacidadesService.get(
      '/tipodocumento'
    );
    this.listaCausaAnulacion =
      await this.parametrosIncapacidadesService.getIncapacidad(
        '/CausaAnulacion'
      );

    const perfilUbicacion2: IPerfilComple =
      JSON.parse(localStorage.getItem('complementario2') || '') || '';
    this.perfilUbicacion = perfilUbicacion2;
    console.log(this.perfilUbicacion);

    this.idEntidad = this.perfilUbicacion.idEntidad;

    this.spinnerService.hide('spinnerCargaInicial');

    this.consultaPlanContingenciaActual =
      await this.consultarPlanContingenciaExistente();
    if (this.consultaPlanContingenciaActual != null) {
      await this.Alertas.alertaInformativa(
        'Advertencia',
        'Existe un plan de contingencia activo, no se pueden anular incapacidades',
        'Cerrar'
      );
      this.router.navigate(['/menu-principal']);
    }
  }

  async consultarPlanContingenciaExistente() {
    let valuesParam = {
      id_entidad: this.perfilUbicacion.idEntidad,
    };

    this.consultaPlanContingenciaActual =
      await this.parametrosIncapacidadesService.postIncapacidad(
        '/Incapacidad/ConsultaPlanContingencia',
        valuesParam
      );
    console.log(this.consultaPlanContingenciaActual);
    return this.consultaPlanContingenciaActual;
  }
}
