import { Component, Input, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import Stepper from 'bs-stepper';
// import * as incapacidadModel from 'src/app/Models/incapacidad.model';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms'; //listaDocumento
import { Observable } from 'rxjs'; //listaDocumento
import { AlertasService } from 'src/app/services/alertas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { ModalDetalleIncapacidadCRComponent } from './modal-incapacidad/modal-detalle-incapacidad.component';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-detalle-incapacidad',
  templateUrl: './concepto-rehabilitacion.component.html',
  styleUrls: ['./concepto-rehabilitacion.component.scss']
})
export class ConceptoRehabilitacionComponent implements OnInit {

  listaTipoDocumento: any;
  listaConceptoRehabilitacion: any;

  resumenConceptoRehabilitacion: any;

  baseUrlSIIN = environment.baseSiteSIIN;

  ConceptoResult: any;
  conceptoRegistro: any;
  perfilEntidad: any;
  perfil1: any;
  usuarioLogin: any;
  conceptoExistente: any;
  numeroConcepto: '';
  pacienteGet: any;

  paciente: any;
  mensajeModalCuerpo: any;
  incapacidadVerificada = false;
  parametrosIncapacidadesService: ParametrosIncapacidadesService;
  listaMensajeModal = [];

  submittedPersona = false;
  submittedConcepto = false;

  submittedIncapacidad = false;
  variasIncapacidades: boolean;

  incapacidadBase: any;
  listIncapacidades: any[] = []

  incapacidadSeleccionada: any;

  conceptoRegistrado: any;

  medico: any;
  medicoResult: any;
  medicoValidado = false;
  numeroIncapacidad: any;
  perfilUbicacion: any;
  idEntidad: any;
  formConsultaIncapacidad: FormGroup;
  formConceptoRehabilitacion: FormGroup;
  formIncapacidadConcepto: FormGroup;
/*  incapacidadForm: FormGroup;*/

  diagnosticos: any;
  origen: any;
  fechaHoy: number = Date.now();
  fechaMin: any;

  incapacidadesResult: any;

  optionModalidadIntramural: any;
  optionRetroActivaSi: any;
  /*  mensajeAnulacion: string;*/
  

  optionsModal: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    backdropClass: "light-blue-backdrop",
    windowClass: 'dark-modal',
    centered: true
  };

  constructor(private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private parametrosIncapacidadesServiceIn: ParametrosIncapacidadesService,
    private modal: NgbModal,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private Alertas: AlertasService

  ) {

    this.parametrosIncapacidadesService = parametrosIncapacidadesServiceIn;

    this.formConsultaIncapacidad = this.fb.group({
/*      numeroIncapacidad: ['', Validators.required],*/
      tipoDocumentoId: ['', Validators.required],
      numeroDocumento: ['', Validators.required]
    })

    this.formConceptoRehabilitacion = this.fb.group({
      conceptoRehabilitacion: ['', Validators.required],
      numeroConcepto: [''],
      observaciones: [''],
      /*campos: [''],*/
      fecha_emision_concepto: [''],
      tipoDocumentoId: ['', Validators.required],
      numeroDocumento: ['', Validators.required]
    })

    this.formIncapacidadConcepto = this.fb.group({
      /*incapacidadConcepto: ['', Validators.required]*/
      incapacidadConcepto: ['']
    })

    this.paciente = {
      primerNombre: '',
      SegundoNombre: '',
      primerApellido: '',
      SegundoApellido: '',
      numeroIncapacidad: '',
      tipoDocumento: '',
      numeroDocumento: ''
    }

    this.conceptoRegistro = {
      id_incapacidad: '',
      concepto_rehabilitacion: Object,
      tipo_documento_pac: '',
      numero_documento_pac: '',
      numero_concepto: '',
      observaciones: '',
      fecha_emision: '',
      id_doc_medico_emite: '',
      numero_doc_medico_emite: '',
      id_entidad_registra: '',
      numero_doc_entidad_registra: '',
      nombre_entidad_registra: '',
      id_doc_medico_registra: '',
      numero_doc_medico_registra: '',
      nombres_medico_registra: ''
    }
  }

  private stepper: Stepper;

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.spinnerService.show('spinnerCargaInicial');
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.variasIncapacidades = false;

    this.cargarListas();
  }

  next() {
    this.stepper.next();
  }
  
  //calcularFechaFinal() {

  //}

  refresh(): void {
    this.ngOnInit();
  }

  get f_persona() { return this.formConsultaIncapacidad.controls; }
  get f_conceptoRehabilitacion() { return this.formConceptoRehabilitacion.controls; }

  get f_incapacidad() { return this.formIncapacidadConcepto.controls; }

  async buscarIncapacidad(contenidoIncapacidad) {
    try {
      this.variasIncapacidades = false;
      this.spinnerService.show('spinnerCargaAnulacion');
      this.submittedPersona = true;
      // stop here if form is invalid
      if (this.formConsultaIncapacidad.invalid) {
        this.spinnerService.hide('spinnerCargaAnulacion');
        return;
      }

      this.pacienteGet = {
        tipo_documento: this.formConsultaIncapacidad.get('tipoDocumentoId')?.value,
        numero_documento: this.formConsultaIncapacidad.get('numeroDocumento')?.value
      }


      this.conceptoExistente = await this.parametrosIncapacidadesService.postDataIncapacidad('/ConceptoRehabilitacion/ConsultarCRPorPaciente', this.pacienteGet);
      console.log(this.conceptoExistente);

      this.incapacidadesResult = await this.parametrosIncapacidadesService.postDataIncapacidad('/ConceptoRehabilitacion/ConsultaIncapacidadCR', this.pacienteGet);
      console.log(this.incapacidadesResult)
      console.log(this.listIncapacidades)

      if (this.incapacidadesResult.length > 1) {
        this.variasIncapacidades = true;

        this.formIncapacidadConcepto = this.fb.group({
          incapacidadConcepto: ['', Validators.required]
        })
      }
      //if (this.incapacidadVerificada == true) {
      //  this.next();
      //}
      this.validarIncapacidad(contenidoIncapacidad);
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
    catch {
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
  }

  async AsignarIncapacidad() {
    if (this.variasIncapacidades) {
      this.spinnerService.show('spinnerCargaAnulacion');
      this.submittedIncapacidad = true;
      // stop here if form is invalid
      if (this.formIncapacidadConcepto.invalid) {
        this.spinnerService.hide('spinnerCargaAnulacion');
        return;
      }
      this.spinnerService.hide('spinnerCargaAnulacion');
      let idIncapacidadSeleccionada = this.formIncapacidadConcepto.get('incapacidadConcepto')?.value
      this.incapacidadSeleccionada = this.listIncapacidades.filter(
        o => (o.id_incapacidad == idIncapacidadSeleccionada));
      //console.log(this.incapacidadSeleccionada);

    }
    else {
      this.incapacidadSeleccionada = this.listIncapacidades;
    }
    this.fechaMin = this.incapacidadSeleccionada[0].fecha_inicio

    console.log(this.fechaMin)

    this.next();
  }

  async abrirModalDetalleIncapacidad(modeloIncapacidad: IIncapacidad) {
    console.log(modeloIncapacidad)
    const modalRef = this.modalService.open(ModalDetalleIncapacidadCRComponent, this.optionsModal);
    modalRef.componentInstance.incapacidadIn = { name: '', id: 0, 'incapacidad_data': modeloIncapacidad/*, 'paciente_data': this.pacienteIn */};
    modalRef.result.then(async (result) => {
      console.log(result)

    }
      );
    
  }

  async validarFechaEmision() {
    let fechaConcepto = new Date(this.formConceptoRehabilitacion.get('fecha_emision_concepto')?.value)
    let diff = (fechaConcepto.getTime() + 1) - new Date(this.fechaMin).getTime()
    //se obtiene diferencia en días
    diff = Math.round(diff / (1000 * 60 * 60 * 24));
    console.log(diff)

    if (diff > 120) {
      await this.Alertas.alertaInformativa('Advertencia', 'La diferencia entre la fecha de inicio de la incapacidad y la fecha de emisión es mayor a 120 días (' + diff + ')', 'Cerrar');
    }

  }


  async validarIncapacidad(contenidoIncapacidad) {
    try {
      this.spinnerService.show('spinnerCargaAnulacion');
    if (this.incapacidadesResult.length == 0) {
     /* this.mensajeModalCuerpo = 'El paciente ingresado No tiene incapacidades a las que se les pueda generar un Concepto de Rehabilitación'*/
      this.incapacidadVerificada = false;
      await this.Alertas.alertaInformativa('Advertencia', 'El paciente ingresado No tiene incapacidades a las que se les pueda generar un Concepto de Rehabilitación', 'Cerrar');
      /*this.listaMensajeModal = [];*/
      /*this.openModalMensaje(contenidoIncapacidad)*/
    }
    else {
      if (this.conceptoExistente?.numero_concepto != null) {
        this.mensajeModalCuerpo = 'Este paciente ya tiene un Concepto de Rehabilitación:'
        this.conceptoExistente.fecha_emision = this.conceptoExistente.fecha_emision.substring(0, 10);
        this.conceptoExistente.fecha_registro = this.conceptoExistente.fecha_registro.substring(0, 10);
/*        event.preventDefault();*/
        this.modal.open(contenidoIncapacidad);
      }
      else {
        this.formConsultaIncapacidad.reset();
        this.next()
      }
      this.poblarIncapacidades();

      }
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
    catch {
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
  }

  async poblarIncapacidades() {

    this.paciente = {
      primerNombre: this.incapacidadesResult[0][0]?.primer_nombre_pac,
      segundoNombre: this.incapacidadesResult[0][0]?.segundo_nombre_pac,
      primerApellido: this.incapacidadesResult[0][0]?.primer_apellido_pac,
      segundoApellido: this.incapacidadesResult[0][0]?.segundo_apellido_pac,
      numeroIncapacidad: this.incapacidadesResult[0][0]?.id_incapacidad,
      tipoDocumento: this.incapacidadesResult[0][0]?.tipo_documento_pac,
      numeroDocumento: this.incapacidadesResult[0][0]?.numero_documento_pac
    }
    this.diagnosticos = this.incapacidadesResult[0][0]?.diagnostico?.cod_diagnostico + "-" + this.incapacidadesResult[0][0]?.diagnosticoRelacionUno?.cod_diag_relacion_uno + "-" + this.incapacidadesResult[0][0]?.diagnosticoRelacionDos?.cod_diag_relacion_dos
    this.origen = this.incapacidadesResult[0][0]?.origen;

    this.incapacidadBase = {
      id_incapacidad: '',
      diagnostico_principal: {
        codigo: '',
        descripcion: '',
      },
      diagnostico_relacion_uno: {
        codigo: '',
        descripcion: '',
      },
      diagnostico_relacion_dos: {
        codigo: '',
        descripcion: '',
      },
      fecha_inicio: '',
      fecha_fin: '',
    }
    //se limpia el array de listIncapacidades
    this.listIncapacidades.length = 0;

    for (var i in this.incapacidadesResult) {
      this.incapacidadBase = {
        id_incapacidad: this.incapacidadesResult[i][0]?.id_incapacidad,
        diagnostico_principal: {
          codigo: this.incapacidadesResult[i][0]?.diagnostico.cod_diagnostico,
          descripcion: this.incapacidadesResult[i][0]?.diagnostico.descripcion,
        },
        diagnostico_relacion_uno: {
          codigo: this.incapacidadesResult[i][0]?.diagnosticoRelacionUno?.cod_diag_relacion_uno,
          descripcion: this.incapacidadesResult[i][0]?.diagnosticoRelacionUno?.descripcion,
        },
        diagnostico_relacion_dos: {
          codigo: this.incapacidadesResult[i][0]?.diagnosticoRelacionDos?.cod_diag_relacion_dos,
          descripcion: this.incapacidadesResult[i][0]?.diagnosticoRelacionDos?.descripcion,
        },
        fecha_inicio: this.incapacidadesResult[i][0]?.fecha_inicio,
        fecha_fin: this.incapacidadesResult[i][0]?.fecha_fin,
      }
      this.listIncapacidades.push(this.incapacidadBase)
    }
  }

  modificarCR() {
    this.incapacidadVerificada = true;
    this.modal.dismissAll();
    this.next();
    //this.formConceptoRehabilitacion.patchValue({
    //  conceptoRehabilitacion: this.conceptoExistente?.concepto_rehabilitacion.id_concepto_rehabilitacion,
    //  numeroConcepto: this.conceptoExistente?.numero_concepto,
    //  observaciones: this.conceptoExistente?.observaciones,
    //  fecha_emision_concepto: this.conceptoExistente?.fecha_emision,
    //  tipoDocumentoId: this.conceptoExistente?.id_doc_medico_emite,
    //  numeroDocumento: this.conceptoExistente?.numero_doc_medico_emite

    //})

  }

  //openModalMensaje(contenidoIncapacidad) {
  //  console.log("x3")
    
  //  console.log("x4")
  //}

  async confirmarConcepto() {
    try {
      this.spinnerService.show('spinnerCargaAnulacion');
      this.conceptoRegistro = {
        id_incapacidad: this.incapacidadSeleccionada[0].id_incapacidad,
        tipo_documento_pac: this.paciente.tipoDocumento,
        numero_documento_pac: this.paciente.numeroDocumento,
        concepto_rehabilitacion: this.resumenConceptoRehabilitacion.concepto_rehabilitacion,
        numero_concepto: this.resumenConceptoRehabilitacion.numero_concepto,
        observaciones: this.resumenConceptoRehabilitacion.observaciones,
        fecha_emision: this.resumenConceptoRehabilitacion.fecha_emision,
        id_doc_medico_emite: this.resumenConceptoRehabilitacion.id_doc_medico_emite,
        numero_doc_medico_emite: this.resumenConceptoRehabilitacion.numero_doc_medico_emite,
        id_entidad_registra: 'nit',
        numero_doc_entidad_registra: this.perfilEntidad[0].nit,
        nombre_entidad_registra: this.perfilEntidad[0].nombreEntidad,
        id_doc_medico_registra: this.usuarioLogin.tipoDocumento,
        numero_doc_medico_registra: this.usuarioLogin.numeroDocumento,
        nombres_medico_registra: this.usuarioLogin.primerNombre + " " +this.usuarioLogin.primerApellido
      }

      this.ConceptoResult = await this.parametrosIncapacidadesService.postDataIncapacidad('/ConceptoRehabilitacion/GuardarConceptoRehabilitacion', this.conceptoRegistro);

 /*     console.log("df");*/
      if (this.ConceptoResult.id_registro_concepto) {
        this.conceptoRegistrado = true
        /*await this.Alertas.alertaInformativa('Advertencia', result.mensaje, 'Cerrar');*/
        /*return;*/
      }
      this.next();
      console.log(this.ConceptoResult);

      this.modal.dismissAll()
      this.spinnerService.hide('spinnerCargaAnulacion');
    }
    catch {
        this.spinnerService.hide('spinnerCargaAnulacion');
    }
  }

  
   
  async openModalCR(contenido) {
    this.submittedConcepto = true;

    this.medico = {
      tipo_documento: this.formConceptoRehabilitacion.get('tipoDocumentoId').value,
      numero_documento: this.formConceptoRehabilitacion.get('numeroDocumento').value,
    }
    if (this.medico.tipo_documento != '' && this.medico.numero_documento != '') {
      this.medicoResult = await this.parametrosIncapacidadesService.postDataIncapacidad('/ConsultaMedico/ConsultaMedicoRethus', this.medico);

      if (this.medicoResult?.medico_encontrado != true) {
        await this.Alertas.alertaInformativa('Error', 'Profesional de la Salud NO está registrado en Rethus', 'Cerrar');
        this.f_conceptoRehabilitacion.tipoDocumentoId.setValue('');
        this.f_conceptoRehabilitacion.numeroDocumento.setValue('');
        this.medicoValidado = false;
      }
      else {
        this.medicoValidado = true;
        await this.Alertas.alertaInformativa('Succes', 'Profesional de la Salud está registrado en Rethus', 'Cerrar');
      }
    }
    console.log(this.medicoResult);
    if (this.medicoValidado == false) {
      return;
    }

    // stop here if form is invalid
    if (this.formConceptoRehabilitacion.invalid || this.medicoValidado != true) {
      console.log("invva")
      return;
    }


    let valueConceptoRehabilitacion = this.formConceptoRehabilitacion.get('conceptoRehabilitacion')?.value;
    console.log(valueConceptoRehabilitacion);
    let concepto = this.listaConceptoRehabilitacion.find(i => i.id_concepto_rehabilitacion == valueConceptoRehabilitacion);
    console.log(concepto);

    this.resumenConceptoRehabilitacion =  {
      /*numeroIncapacidad: this.formConsultaIncapacidad.get('numeroIncapacidad')?.value,*/
      fecha_emision: this.formConceptoRehabilitacion.get('fecha_emision_concepto')?.value,
      concepto_rehabilitacion: /*this.formConceptoRehabilitacion.get('conceptoRehabilitacion')?.value*/concepto,
      numero_concepto: this.formConceptoRehabilitacion.get('numeroConcepto')?.value,
      observaciones: this.formConceptoRehabilitacion.get('observaciones')?.value,
      id_doc_medico_emite: this.formConceptoRehabilitacion.get('tipoDocumentoId')?.value,
      numero_doc_medico_emite: this.formConceptoRehabilitacion.get('numeroDocumento')?.value
      /*numero_documento_pac: this.formConsultaIncapacidad.get('numeroDocumento')?.value*/
    }
     this.modal.open(contenido, { size: 'xl' });
  }

  goBack() {
    this.stepper.previous();
  }

  finalizar() {
    location.href = 'incapacidades/concepto-rehabilitacion';
  }


  reExpedir() {
    location.href = 'incapacidades/registrar-incapacidad/' + this.numeroIncapacidad;
}

  async cargarListas() {
    this.listaTipoDocumento = await this.parametrosIncapacidadesService.get('/tipodocumento');
    this.listaConceptoRehabilitacion = await this.parametrosIncapacidadesService.getIncapacidad('/ConceptoRehabilitacionList');
    //this.listaCausaAnulacion = await this.parametrosIncapacidadesService.get('/CausaAnulacion');

    let item1 = this.listaConceptoRehabilitacion.find(i => i.id_concepto_rehabilitacion === 1);
    console.log(item1.descripcion);

    const perfil2: IPerfilComple = JSON.parse(localStorage.getItem('complementario2')) || '';
    this.perfilUbicacion = perfil2;
    console.log(this.perfilUbicacion);

    const perfil1: IPerfil = JSON.parse(localStorage.getItem('complementario')) || '';
    this.perfilEntidad = perfil1;
    console.log(this.perfilEntidad);
    
    const user = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioLogin = user;
    console.log(this.usuarioLogin);

    this.idEntidad = this.perfilUbicacion.idEntidad;

    this.spinnerService.hide('spinnerCargaInicial');
  }

}
