import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';

import { environment } from 'src/environments/environment';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IPerdidaCapacidadLaboral } from 'src/app/models/PerdidaCapacidadLaboral.model';
import { ModalConfirmacionPCLComponent } from './modal-confirmacion-pcl/modal-confirmacion-pcl.component';
import { formatDate } from '@angular/common';
import { AlertasService } from 'src/app/services/alertas.service';


@Component({
  selector: 'app-perdida-capacidad-laboral',
  templateUrl: './perdida-capacidad-laboral.component.html',
  styleUrls: ['./perdida-capacidad-laboral.component.scss'],
})
export class PerdidaCapacidadLaboralComponent implements OnInit { 

  private stepper: Stepper;
  registroExitoso: boolean = false;
  listaOrigen: any;
  listaTipoDocumento: any;

  baseUrlSIIN = environment.baseSiteSIIN;
  
  showCountryErrorMessage: boolean = false;
  personaForm: FormGroup;
  submittedPaciente = false;
  perdidaCapacidadLaboralForm: FormGroup;
  submittedPerdidaCapacidadLaboral = false;
  // informePerdidaCapacidadForm: FormGroup;
  // submittedInformePerdidaCapacidad= false;

  esVisibleTipoProfesional1: boolean;
  esVisibleTipoProfesional2: boolean;

  mostrarResultados: boolean;
  listaConceptoRehabilitacion: any;
  pacienteGet: any;
  conceptosRehabilitacionResult: any;
  
  listIncapacidades: any[] = []
  listaConceptoListaResult: any;

  pcl =  new IPerdidaCapacidadLaboral();
  


  codigo_diagnostico_principal: string;
  keyword = 'codigo';
  fechaHoy: number = Date.now();
  listaDiagnosticosCie10_principal: Array<any> = [];
  listaDiagnosticosCie10_relacion_1: Array<any> = [];
  listaDiagnosticosCie10_relacion_2: Array<any> = [];

  listaPedidadCapacidadLaboralPorConcepto: any= [];

  formVerPerdidaCapacidadLaboral: boolean = false;

  error: any;
  esVisibleDiagnosticorelacionado1: boolean = false; // hidden by default
  esVisibleDiagnosticorelacionado2: boolean = false; // hidden by default

  optionsModal: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    backdropClass: 'light-blue-backdrop',
    windowClass: 'dark-modal',
    centered: true,
  };
  idConceptoSeleccionado: any;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private parametrosIncapacidadesService: ParametrosIncapacidadesService,
    private modalService: NgbModal,
    private Alertas: AlertasService

  ) {
    this.createPersonaForm();
    this.createPerdidaCapacidadLaboralForm();
  }
  /****** Stepper ******/
  next() {
    this.stepper.next();
    return false;
  }
  goBack() {
    this.stepper.previous();
  }
  nextTo(value: any) {
    this.stepper.to(value);
  }
  onSubmit() {
    return false;
  }

  ngOnInit() {

    this.mostrarResultados = false;
    this.spinnerService.show('spinnerCargaInicial');
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true,
    });
    this.cargarListas();
  }

  /********* Formulario buscar persona *************/
  createPersonaForm() {
    this.personaForm = this.formBuilder.group({
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f_persona() {
    return this.personaForm.controls;
  }

  createPerdidaCapacidadLaboralForm() {
    
    const currentDate = new Date(Date.now())

    this.perdidaCapacidadLaboralForm = this.formBuilder.group({
      numeroRegistro: [{ value: '', disabled: false }, Validators.required],
      fechaRegistroCalificacion: [{ value: this.getFormattedDate(currentDate), disabled: false }],
      //fechaRegistroCalificacion_string: [{ value: this.getFormattedDate(currentDate), disabled: false }],
      id_origen: [{ value: '', disabled: false }, Validators.required],
      porcentajePCL: [{ value: '', disabled: false }, Validators.required],
      fechaCalificacionPCL: [{ value: '', disabled: false }, Validators.required],
      fechaEstructuracion: [{ value: '', disabled: false }, Validators.required],
      nuevaCalificacion: [{ value: '', disabled: false }, Validators.required],
      observacionesPCL: [{ value: '', disabled: false }, Validators.required],
      tipoProfesional: [{ value: '', disabled: false }, Validators.required],

      despachoAutoridadJudicial: [{ value: '', disabled: true }, Validators.required,],
      nombreJuez: [{ value: '', disabled: true }, Validators.required,],

      tipoDocumentoEntidad: [{ value: '', disabled: true }, Validators.required,],
      numeroDocumentoEntidad: [{ value: '', disabled: true }, Validators.required,],
      nombreRazonSocialEntidad: [{ value: '', disabled: true }, Validators.required],

      tipoDocumentoProfesionalEmite: [{ value: '', disabled: true }, Validators.required,],
      numeroDocumentoProfesionalEmite: [{ value: '', disabled: true }, Validators.required,],
      nombreProfesionalEmite: [{ value: '', disabled: true }, Validators.required],
    });
  }

  get f_PCL() {
    return this.perdidaCapacidadLaboralForm.controls;
  }

  async buscarConceptosRehabilitacion() {
    try {
      
      this.spinnerService.show('spinnerConsultaConceptoRehabilitacion');
      this.submittedPaciente = true;
      // stop here if form is invalid
      if (this.personaForm.invalid) {
        return;
      }

      this.pacienteGet = {
        tipo_documento: this.personaForm.get('tipoDocumento')?.value,
        numero_documento: this.personaForm.get('numeroDocumento')?.value
      }

      this.listaConceptoRehabilitacion = await this.parametrosIncapacidadesService.postIncapacidad('/ConsultaConceptoRehabilitacion/ConsultarListaCR', this.pacienteGet);
      console.log(this.listaConceptoRehabilitacion);
            

      if (this.listaConceptoRehabilitacion.length > 0  ) {
       this.mostrarResultados = true;
      }

      this.spinnerService.hide('spinnerConsultaConceptoRehabilitacion');
    }
    catch {
      this.spinnerService.hide('spinnerConsultaConceptoRehabilitacion');
    }       
}

async abrirListaDePerdidaCapacidad(idConcepto:any) {
  this.spinnerService.show('spinnerConsultaConceptoRehabilitacion');
  //Consultar lista de perdida de capacida laboral
  this.listaPedidadCapacidadLaboralPorConcepto = await this.parametrosIncapacidadesService.consultarPerdidaCapacidadLaboralPorIdConcepto(idConcepto);
  console.log(this.listaPedidadCapacidadLaboralPorConcepto)
  
  this.idConceptoSeleccionado = idConcepto;

  this.nextTo(2);
  this.spinnerService.hide('spinnerConsultaConceptoRehabilitacion');    
}

async abrirVerInformacionPerdida(idPCL:any) {   

  for(let pclBusqueda of this.listaPedidadCapacidadLaboralPorConcepto){
    if(pclBusqueda.numero_registro == idPCL){
      this.f_PCL.numeroRegistro.setValue(pclBusqueda.numero_registro);
      this.f_PCL.fechaRegistroCalificacion.patchValue(formatDate(new Date(pclBusqueda.fecha_registro_calificacion), 'yyyy-MM-dd', 'en'));
      this.f_PCL.id_origen.setValue(pclBusqueda.id_origen);
      this.f_PCL.porcentajePCL.setValue(pclBusqueda.porcentaje_perdida_capacidad_laboral);
      this.f_PCL.fechaCalificacionPCL.patchValue(formatDate(new Date(pclBusqueda.fecha_calid_incapacidadificacion_PCL), 'yyyy-MM-dd', 'en'));
      this.f_PCL.fechaEstructuracion.setValue(formatDate(new Date(pclBusqueda.fecha_estructuracion), 'yyyy-MM-dd', 'en'));
      this.f_PCL.nuevaCalificacion.setValue(pclBusqueda.nueva_calificacion);
      this.f_PCL.observacionesPCL.setValue(pclBusqueda.observaciones);
      this.f_PCL.tipoProfesional.setValue(pclBusqueda.tipo_profesional);

      this.f_PCL.despachoAutoridadJudicial.setValue(pclBusqueda.despacho_autoridad_judicial);
      this.f_PCL.nombreJuez.setValue(pclBusqueda.nombres_apellidos_juez);

      this.f_PCL.tipoDocumentoEntidad.setValue(pclBusqueda.tipo_documento_entidad);
      this.f_PCL.numeroDocumentoEntidad.setValue(pclBusqueda.numero_documento_entidad);
      this.f_PCL.nombreRazonSocialEntidad.setValue(pclBusqueda.nombre_razon_social);

      this.f_PCL.tipoDocumentoProfesionalEmite.setValue(pclBusqueda.tipo_documento_emite);
      this.f_PCL.numeroDocumentoProfesionalEmite.setValue(pclBusqueda.numero_documento_emite);
      this.f_PCL.nombreProfesionalEmite.setValue(pclBusqueda.nombre_profesional_emite);
      
      this.changeValueOrigen();
      break;
    }
  }

  this.modoVisualizacion(true);
  this.nextTo(3);
}

async modoVisualizacion(esModoVisualizacion: any){
  this.formVerPerdidaCapacidadLaboral = esModoVisualizacion;
  if(esModoVisualizacion){

    this.perdidaCapacidadLaboralForm.disable();

  }else{
    this.perdidaCapacidadLaboralForm.enable();
  }
}


async ObtenerValorNumeroRegistro() {
  const value = await this.parametrosIncapacidadesService.obtenerSiguienteValorSecuencia('PCL');
  return value.resultado;
}

async abrirNuevoRegistroPerdida(){

  this.modoVisualizacion(false);

  this.pcl = new IPerdidaCapacidadLaboral();
  this.perdidaCapacidadLaboralForm.reset();

  this.f_PCL.fechaRegistroCalificacion.patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
      
  const numeroObtenido = await this.ObtenerValorNumeroRegistro();
  this.f_PCL.numeroRegistro.setValue(numeroObtenido);
  this.nextTo(3);
}


async cargarListas() {
    this.listaTipoDocumento = await this.parametrosIncapacidadesService.get('/tipodocumento');
    console.log('listaTipoDocumento cargada con exito');
    this.spinnerService.hide('spinnerCargaInicial');

    this.listaOrigen = await this.parametrosIncapacidadesService.get('/origen');
    console.log('listaOrigen cargada con exito');
  }

public changeValueOrigen() {

    if(this.f_PCL.tipoProfesional.value == "1"){
      this.esVisibleTipoProfesional1 = true;
      this.esVisibleTipoProfesional2 = false;

      this.f_PCL.despachoAutoridadJudicial.enable();
      this.f_PCL.nombreJuez.enable();

      this.f_PCL.tipoDocumentoProfesionalEmite.disable();
      this.f_PCL.numeroDocumentoProfesionalEmite.disable();
      this.f_PCL.nombreProfesionalEmite.disable();

      this.f_PCL.tipoDocumentoEntidad.disable();
      this.f_PCL.numeroDocumentoEntidad.disable();
      this.f_PCL.nombreRazonSocialEntidad.disable();

    }
    else if(this.f_PCL.tipoProfesional.value == "2"){
      this.esVisibleTipoProfesional1 = false;
      this.esVisibleTipoProfesional2 = true;

      this.f_PCL.despachoAutoridadJudicial.disable();
      this.f_PCL.nombreJuez.disable();

      this.f_PCL.tipoDocumentoProfesionalEmite.enable();
      this.f_PCL.numeroDocumentoProfesionalEmite.enable();
      this.f_PCL.nombreProfesionalEmite.enable();

      this.f_PCL.tipoDocumentoEntidad.enable();
      this.f_PCL.numeroDocumentoEntidad.enable();
      this.f_PCL.nombreRazonSocialEntidad.enable();

    }else{
      this.esVisibleTipoProfesional1 = false;
      this.esVisibleTipoProfesional2 = false;

      this.f_PCL.despachoAutoridadJudicial.disable();
      this.f_PCL.nombreJuez.disable();

      this.f_PCL.tipoDocumentoProfesionalEmite.disable();
      this.f_PCL.numeroDocumentoProfesionalEmite.disable();
      this.f_PCL.nombreProfesionalEmite.disable();

      this.f_PCL.tipoDocumentoEntidad.disable();
      this.f_PCL.numeroDocumentoEntidad.disable();
      this.f_PCL.nombreRazonSocialEntidad.disable();
    }
  }

  async abrirModalConfirmacion(datosPerdidaIncapacidadLaboral) {

    this.submittedPerdidaCapacidadLaboral = true;

    console.log(datosPerdidaIncapacidadLaboral);
    
    this.pcl.numero_registro = datosPerdidaIncapacidadLaboral.numeroRegistro;
    this.pcl.id_concepto_registro = Number(this.idConceptoSeleccionado);
    this.pcl.fecha_registro_calificacion = datosPerdidaIncapacidadLaboral.fechaRegistroCalificacion;
    this.pcl.id_origen = Number(datosPerdidaIncapacidadLaboral.id_origen);
    this.pcl.porcentaje_perdida_capacidad_laboral = Number(datosPerdidaIncapacidadLaboral.porcentajePCL);
    this.pcl.fecha_calid_incapacidadificacion_PCL = datosPerdidaIncapacidadLaboral.fechaCalificacionPCL;
    this.pcl.fecha_estructuracion = datosPerdidaIncapacidadLaboral.fechaEstructuracion;
    this.pcl.nueva_calificacion = Number(datosPerdidaIncapacidadLaboral.nuevaCalificacion);
    this.pcl.observaciones = datosPerdidaIncapacidadLaboral.observacionesPCL;
    this.pcl.tipo_profesional = Number(datosPerdidaIncapacidadLaboral.tipoProfesional);

    this.pcl.despacho_autoridad_judicial = datosPerdidaIncapacidadLaboral.despachoAutoridadJudicial;
    this.pcl.nombres_apellidos_juez = datosPerdidaIncapacidadLaboral.nombreJuez;

    this.pcl.tipo_documento_entidad = datosPerdidaIncapacidadLaboral.tipoDocumentoEntidad;
    this.pcl.numero_documento_entidad = datosPerdidaIncapacidadLaboral.numeroDocumentoEntidad;
    this.pcl.nombre_razon_social = datosPerdidaIncapacidadLaboral.nombreRazonSocialEntidad;

    this.pcl.tipo_documento_emite = datosPerdidaIncapacidadLaboral.tipoDocumentoProfesionalEmite;
    this.pcl.numero_documento_emite = datosPerdidaIncapacidadLaboral.numeroDocumentoProfesionalEmite;
    this.pcl.nombre_profesional_emite = datosPerdidaIncapacidadLaboral.nombreProfesionalEmite;

    const elemetntFinded = this.listaPedidadCapacidadLaboralPorConcepto.find(element => element.id_concepto_registro == this.idConceptoSeleccionado);
    this.pcl.diagnostico_principal= elemetntFinded?.diagnostico_principal;
    this.pcl.diagnostico_relacion_1= elemetntFinded?.diagnostico_relacion_1;
    this.pcl.diagnostico_relacion_2= elemetntFinded?.diagnostico_relacion_2;

    console.log(    this.pcl);

    // stop here if form is invalid
    if (this.perdidaCapacidadLaboralForm.invalid) {
      return;
    }

    await this.guardarPCL(this.pcl);
  }

  async guardarPCL(pcl:IPerdidaCapacidadLaboral){
    const modalRef = this.modalService.open(ModalConfirmacionPCLComponent,this.optionsModal);
    modalRef.componentInstance.dataIn = {name: '', id: 0, 'pcl_data':pcl};
    await modalRef.result.then(async (result) => {
        console.log(result)

        if(result.resultado == 'si'){
          console.log('confirmado')
          
          let result = await this.parametrosIncapacidadesService.guardarDatosPerdidaCapacidadLaboralIncapacidad(pcl); 
          this.registroExitoso = true;

          console.log(result);
          if(result.codigo){
            //alert('Advertencia ' + result.mensaje)
            await this.Alertas.alertaInformativa('Advertencia',result.mensaje,'Cerrar');
            return;
          }
          //let result = await this.parametrosIncapacidadesService.post('/incapacidad', modelo);
          
          this.next();
      }else{
        console.log('no confirmado')
      }
    });
  }

  refresh(): void { 
    location.href = 'incapacidades/pcl-incapacidad/'
  }



  /************* Funciones generales *****************/
  public getFormattedDate(date: Date) : string {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return year + '-' +  month + '-' + day;
  }


  public getFormattedDateTime(date: Date) : string {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    let hour = date.getHours().toString().length > 1 ? date.getHours().toString() : '0' +date.getHours().toString();
    let minutes = date.getMinutes().toString().length > 1 ? date.getMinutes().toString() : '0' +date.getMinutes().toString();
    let seconds = date.getSeconds().toString().length > 1 ? date.getSeconds().toString() : '0' +date.getSeconds().toString();
    
    return year + '-' +  month + '-' + day + ' ' + hour  + ':' + minutes + ':'+ seconds
  }

  public getFormattedDateEstandar(dateString: string) : string {
    return dateString.split('-')[2] + '/' +  dateString.split('-')[1] + '/' + dateString.split('-')[0];
  }

  public getFormattedDateEstandarfromDate(dateString: string) : string {
    if(dateString){
      let dateStringDMY = dateString.split('T')[0];
      return dateStringDMY.split('-')[2] + '/' +  dateStringDMY.split('-')[1] + '/' + dateStringDMY.split('-')[0];
    }else{
      return '';
    }
  }

}

