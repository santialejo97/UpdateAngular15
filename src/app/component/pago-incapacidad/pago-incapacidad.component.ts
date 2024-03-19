import { Component, Input, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';

import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertasService } from 'src/app/services/alertas.service';
import { environment } from 'src/environments/environment';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { NotificationesService } from 'src/app/services/notificaciones.service';

import {NgbModal,NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ModalAportantesPagoComponent } from '../pago-incapacidad/modal-aportantes-pago/modal-aportantes-pago.component';

@Component({
  selector: 'app-pago-incapacidad',
  templateUrl: './pago-incapacidad.component.html',  
  styleUrls: ['./pago-incapacidad.component.scss']
})
export class pagoIncapacidadComponent implements OnInit {
    name = 'Angular';

    private stepper: Stepper;
    listaTipoDocumento: any;
    listaEstadoPago: any;
    listaCausalGlosa:any;
    registroExitoso: boolean = false;


    baseUrlSIIN = environment.baseSiteSIIN;

    listaTipoPago:any;
    listaCausalDias:any;
   
    //paciente : IPacienteModel;
    incapacidadResumen: any;
    showCountryErrorMessage: boolean = false;
    formPersonaIncapacidad: FormGroup;
    formAportante: FormGroup;
    submittedPago=false;
    submittedAportante=false;
    formInformePagoIncapacidad: FormGroup;
    // IncapacidadResumen : any;
    error : any;
    listaIncapacidadesAnteriores: any;
    listaRelacionPacienteAportante: any;
    mostrarResultados: boolean;

    validacionCausalGlosa: 0;

    tieneMenosdiasPago: boolean = false;
    pagoForm : any = {};
    pagoModel : any = {};

    optionsModal: NgbModalOptions = {
      size: 'lg',
      backdrop:'static',
      backdropClass: "light-blue-backdrop",
      windowClass: 'dark-modal',
      centered: true
    };
 
    constructor(private parametrosIncapacidadesService: ParametrosIncapacidadesService, private Alertas: AlertasService,
    private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, private modalService: NgbModal,
    private notificacionService: NotificationesService,
    ) {

      this.notificacionService.showError('','');

      this.incapacidadResumen =  this.inicializarIncapacidad();
      console.log(this.incapacidadResumen.tipoDocumento)

      this.createPersonaIncapacidadForm(); 
      this.createAportanteIncapacidadForm(); 
      this.createInformePagoForm();
      
    }


    next() {
      this.stepper.next();
    }

    nextTo(value) {
      this.stepper.to(value);
    }

    goBack(){
      this.stepper.previous();
    }

    onSubmit() {
      return false;
    }

    ngOnInit() {
      this.listaIncapacidadesAnteriores = [];
      this.mostrarResultados = false;
      this.spinnerService.show('spinnerCargaInicial');
      this.stepper = new Stepper(document.querySelector('#stepper1'), {
        linear: true,
        animation: true })
      
      this.cargarListas();        
    }

    createPersonaIncapacidadForm() {
      this.formPersonaIncapacidad = this.formBuilder.group({
        tipoDocumento: [{value: 'CC', disabled: false}, Validators.required ],
        numeroDocumento: [{value: '', disabled: false}, Validators.required ],
        numeroIncapacidad: [{value: '', disabled: false}, Validators.required]
      });
    }
    get f_personaIncapacidad() { return this.formPersonaIncapacidad.controls; }

    createAportanteIncapacidadForm() {
      this.formAportante = this.formBuilder.group({
        tipoDocumentoAportante: [{value: '', disabled: false}, Validators.required ],
        numeroDocumentoAportante: [{value: '', disabled: false}, Validators.required ], 
        razonSocialAportante: [{value: '', disabled: false}], 
      });
    }
    get f_aportante() { return this.formAportante.controls; }

    createInformePagoForm() {
      this.formInformePagoIncapacidad = this.formBuilder.group({

        fechaRadicacionInc: [{value: '', disabled: false} ],
        estadoPago: [{value: '', disabled: false}, Validators.required ],
        numeroAutorizacion: [{value: '', disabled: false}, Validators.required ],
        tipoPago: [{value: '', disabled: false}, Validators.required ],
        causalGlosa: [{value: '', disabled: true}, Validators.required ],
        valorPago: [{value: '', disabled: false}, Validators.required ],
        diasPago: [{value: '', disabled: false}, Validators.required ],
        causalDiasPago: [{value: '', disabled: false}, Validators.required ],
        fechaPago: [{value: '', disabled: false}, Validators.required ],
        ingresoBaseCotizacion: [{value: '', disabled: false}, Validators.required ],

        tipoDocumentoAportante: [{value: '', disabled: false}, Validators.required ],
        numeroDocumentoAportante: [{value: '', disabled: false}, Validators.required ], 
        razonSocialAportante: [{value: '', disabled: false}], 

      });

      // this.f_pago.fechaRadicacionInc.setValue('2022-09-30');
      // this.f_pago.estadoPago.setValue('1');
      // this.f_pago.numeroAutorizacion.setValue('1234');
      // this.f_pago.tipoPago.setValue('1');
      // this.f_pago.causalGlosa.setValue('1');
      // this.f_pago.valorPago.setValue('22222');
      // this.f_pago.diasPago.setValue('2');
      // this.f_pago.causalDiasPago.setValue('1');
      // this.f_pago.fechaPago.setValue('2022-10-01');
      // this.f_pago.ingresoBaseCotizacion.setValue('3333');
    }

    // convenience getter for easy access to form fields
    get f_pago() { return this.formInformePagoIncapacidad.controls; }


    deshabilitarValidaciones(){

      
      if(this.f_personaIncapacidad.numeroIncapacidad.value != ''){       
        this.f_personaIncapacidad.tipoDocumento.setValidators(null);
        this.f_personaIncapacidad.numeroDocumento.setValidators(null);
        this.f_personaIncapacidad.numeroIncapacidad.setValidators(Validators.required);
      }else if (this.f_personaIncapacidad.numeroDocumento.value != ''){        
        this.f_personaIncapacidad.tipoDocumento.setValidators(Validators.required);
        this.f_personaIncapacidad.numeroDocumento.setValidators(Validators.required);
        this.f_personaIncapacidad.numeroIncapacidad.setValidators(null);        
      }else{
        this.f_personaIncapacidad.tipoDocumento.setValidators(Validators.required);
        this.f_personaIncapacidad.numeroDocumento.setValidators(Validators.required);
        this.f_personaIncapacidad.numeroIncapacidad.setValidators(Validators.required);       
      }      
      
      this.f_personaIncapacidad.tipoDocumento.updateValueAndValidity();
      this.f_personaIncapacidad.numeroDocumento.updateValueAndValidity();
      this.f_personaIncapacidad.numeroIncapacidad.updateValueAndValidity();      
    }

    async validarDatosAportante(){
      
      this.submittedAportante = true;

      // stop here if form is invalid
      if (this.formAportante.invalid) {
        await this.Alertas.alertaInformativa('Advertencia', 'Debe seleccionar un aportante' ,'Cerrar');
        return;
      }else{

        const formAportanteData = this.formAportante.value;

        const pagoValue =    
        {    
          id_incapacidad : this.incapacidadResumen.id_incapacidad,
          tipo_documento_aportante: formAportanteData.tipoDocumentoAportante,
          numero_documento_aportante: formAportanteData.numeroDocumentoAportante
        };
        let result = await this.parametrosIncapacidadesService.postIncapacidad('/RegistrarPago/ConsultarPagos', pagoValue);
        if(result.length > 0){
          await this.Alertas.alertaInformativa('Advertencia', 'La incapidad ya tien un pago reportado para este aportante' ,'Cerrar');
          return;
        }
        
        console.log('formAportanteData.tipoDocumentoAportante')
        console.log(formAportanteData.tipoDocumentoAportante)
        this.f_pago.tipoDocumentoAportante.setValue(formAportanteData.tipoDocumentoAportante);
        this.f_pago.numeroDocumentoAportante.setValue(formAportanteData.numeroDocumentoAportante);
        this.f_pago.razonSocialAportante.setValue(formAportanteData.razonSocialAportante);
        this.next();
      }
    }

    async buscarIncapacidadesAnteriores() : Promise<any> { 

      //Se agrega spinner     
      
        this.deshabilitarValidaciones();
      
        // stop here if form is invalid
        if (this.formPersonaIncapacidad.invalid) {
            return;
        }
        this.spinnerService.show('spinnerConsultaIncapacidad');
        try {
          
        let valuesParam = {
                            tipo_documento_pac : this.f_personaIncapacidad.tipoDocumento.value, 
                            numero_documento_pac: this.f_personaIncapacidad.numeroDocumento.value, 
                            id_incapacidad: this.f_personaIncapacidad.numeroIncapacidad.value, 
                            id_usuario_hercules: 1,
                            filtroUltimos30dias: false,
                            excluirAnuladas : false};
        this.listaIncapacidadesAnteriores = await this.parametrosIncapacidadesService.postIncapacidad('/Incapacidad/ConsultaPorPaciente', valuesParam);
        
        console.log('this.listaIncapacidadesAnteriores');
        console.log(this.listaIncapacidadesAnteriores);
      
        for(let incElement of this.listaIncapacidadesAnteriores){  
          let valuesParamQuery = {
            tipo_documento_pac : incElement.tipo_documento_pac, 
            numero_documento_pac: incElement.numero_documento_pac, 
            id_incapacidad: incElement.id_incapacidad};
            let result = await this.parametrosIncapacidadesService.postIncapacidad('/ConsultarRegistroPago/ConsultarRegistroPago', valuesParamQuery);
            incElement.id_estado_pago_validar = result;
            console.log(result);
        }
       
        this.mostrarResultados = true;
        this.spinnerService.hide('spinnerConsultaIncapacidad');
        
      } catch {
        this.spinnerService.hide('spinnerConsultaIncapacidad');
       
      }
      
          
    }

    async buscarInformeIncapacidad(incapacidadIndex:any){

          this.listaRelacionPacienteAportante = [];
    
          //Se agregar spinner
          this.spinnerService.show('spinnerConsultaIncapacidad');
          try {
            if(this.listaIncapacidadesAnteriores[incapacidadIndex].id_estado_pago_validar == 2){
              await this.Alertas.alertaInformativa('Advertencia', 'Incapacidad no encontrada' ,'Cerrar');
                return;
            }else if(this.listaIncapacidadesAnteriores[incapacidadIndex].id_estado_pago_validar == 3){
              await this.Alertas.alertaInformativa('Advertencia', 'Incapacidad se encuentra anulada no procede pago' ,'Cerrar');
                return;
            }else if(this.listaIncapacidadesAnteriores[incapacidadIndex].id_estado_pago_validar == 4){
              await this.Alertas.alertaInformativa('Advertencia', 'El paciente no pertenece al régimen contributivo, especial o de excepción, o subsidiado con afiliación a ARL','Cerrar');
                return;
            }else if(this.listaIncapacidadesAnteriores[incapacidadIndex].id_estado_pago_validar == 5){
              await this.Alertas.alertaInformativa('Advertencia', 'La incapacidad no tiene notificación creada' ,'Cerrar');
              return;
            }
    
            const incapacidad: any = {
              numeroIncapacidad: this.listaIncapacidadesAnteriores[incapacidadIndex].id_incapacidad,
              tipoDocumento: this.listaIncapacidadesAnteriores[incapacidadIndex].tipo_documento_pac,
              numeroDocumento: this.listaIncapacidadesAnteriores[incapacidadIndex].numero_documento_pac 
            }
      
             //listar aportantes por incapacidad
            this.listaRelacionPacienteAportante =  await this.parametrosIncapacidadesService.getIncapacidad('/RelacionPacienteAportante/'+ incapacidad.numeroIncapacidad);
               
            await this.parametrosIncapacidadesService.getIncapacidadAnular('/Incapacidad', incapacidad.numeroIncapacidad,   
            incapacidad.tipoDocumento, incapacidad.numeroDocumento).subscribe(data => {
              
              this.incapacidadResumen = data;
              console.log(this.incapacidadResumen);
      
      
              if(this.incapacidadResumen.notificacionRadicacion){
                this.f_pago.fechaRadicacionInc.setValue(this.getFormattedDateTime(new Date(this.incapacidadResumen.notificacionRadicacion.fecha_notificacion)));
              }
              this.spinnerService.hide('spinnerConsultaIncapacidad');

              // console.log('this.listaRelacionPacienteAportante');
              // console.log(this.listaRelacionPacienteAportante.length);

              //Existen o no aportantes?
              if(this.listaRelacionPacienteAportante != null && this.listaRelacionPacienteAportante.length > 0)
              {
                this.next();
                this.f_pago.tipoDocumentoAportante.disable();
                this.f_pago.numeroDocumentoAportante.disable();
              }else{
                this.nextTo(3);
                this.f_pago.tipoDocumentoAportante.enable();
                this.f_pago.numeroDocumentoAportante.enable();
              }
              
          },error => this.error = error);
            
          } catch (error) {
            this.spinnerService.hide('spinnerConsultaIncapacidad');
          }
    }

    changeEstadoPago(){
      if(this.f_pago.estadoPago.value == 3){
        this.f_pago.causalGlosa.enable();

        this.f_pago.numeroAutorizacion.disable();
        this.f_pago.valorPago.disable();
        this.f_pago.tipoPago.disable();
        this.f_pago.diasPago.disable();
        this.f_pago.fechaPago.disable();
        this.f_pago.ingresoBaseCotizacion.disable();
        this.f_pago.causalDiasPago.disable();

        this.f_pago.numeroAutorizacion.setValue('');
        this.f_pago.valorPago.setValue(0);
        this.f_pago.tipoPago.setValue(null);
        this.f_pago.diasPago.setValue(0);
        this.f_pago.fechaPago.setValue(null);
        this.f_pago.ingresoBaseCotizacion.setValue(0);
      }
      else{
        this.f_pago.causalGlosa.disable();  
        
        this.f_pago.causalGlosa.setValue('');  

        this.f_pago.numeroAutorizacion.enable();
        this.f_pago.valorPago.enable();
        this.f_pago.tipoPago.enable();
        this.f_pago.diasPago.enable();
        this.f_pago.fechaPago.enable();
        this.f_pago.ingresoBaseCotizacion.enable();
        this.f_pago.causalDiasPago.enable();      
      }
    }

    changeDiasPago(){

      console.log(this.incapacidadResumen.dias_incapacidad);
      console.log(this.f_pago.diasPago.value);
      if(this.f_pago.diasPago.value < this.incapacidadResumen.dias_incapacidad){
        this.tieneMenosdiasPago = true;
        this.f_pago.causalDiasPago.enable();
      }
      else{
        this.tieneMenosdiasPago = false;
        this.f_pago.causalDiasPago.disable();
      }
    }


    async cargarListas() {   

      try{
        this.listaTipoDocumento = await this.parametrosIncapacidadesService.get('/tipodocumento');
        console.log('listaTipoDocumento cargada con exito');      
            
        this.listaCausalGlosa = await this.parametrosIncapacidadesService.get('/causalglosa');
        console.log('listaCausalGlosa cargada con exito');

        this.listaTipoPago = await this.parametrosIncapacidadesService.get('/tipopago');
        console.log('listaTipoPago cargada con exito');

        this.listaEstadoPago = await this.parametrosIncapacidadesService.get('/estadopago');
        console.log('listaEstadoPago cargada con exito');

        this.listaCausalDias = await this.parametrosIncapacidadesService.get('/causaldias');
        console.log('listaCausalDias cargada con exito');

        this.spinnerService.hide('spinnerCargaInicial');   

        }finally{
        this.spinnerService.hide('spinnerCargaInicial');
      }
    }

    async validarDatosPago(){
      
      this.submittedPago = true;

      // stop here if form is invalid
      if (this.formInformePagoIncapacidad.invalid) {
        return;
      }

      console.log(this.f_pago.tipoPago.value);

     let idEstadoPago = this.f_pago.estadoPago.value;
     let idCausalGlosa = this.f_pago.causalGlosa.value;
     let idTipoPago = this.f_pago.tipoPago.value;
     let idCausalDias = this.f_pago.causalDiasPago.value;

      let elemento_estado_pago = this.listaEstadoPago.find(function(element:any) {            
        return element.id_estado_pago == idEstadoPago;
      })

      let elemento_causal_glosa = this.listaCausalGlosa.find(function(element:any) {            
        return element.id_causal_glosa == idCausalGlosa;
      })

      let elemento_tipo_pago = this.listaTipoPago.find(function(element:any) {            
        return element.id_tipo_pago == idTipoPago;
      })

      let elemento_causal_dias = this.listaCausalDias.find(function(element:any) {            
        return element.id_causal_dias == idCausalDias;
      })
   
      this.pagoForm = this.formInformePagoIncapacidad.value;

      const perfilUbicacion: IPerfilComple = JSON.parse(localStorage.getItem('complementario2')) || '';
      const perfil: IPerfil = JSON.parse(localStorage.getItem('complementario')) || '';
      
      this.pagoModel =    
      {    
        id_incapacidad : this.incapacidadResumen.id_incapacidad,
        fecha_radicacion : this.pagoForm.fechaRadicacionInc.replace(' ','T'),
        estado_pago:parseInt(this.pagoForm.estadoPago),
        causal_glosa:this.pagoForm.causalGlosa != null && this.pagoForm.causalGlosa != '' ? parseInt(this.pagoForm.causalGlosa) : 0,
        nro_autorizacion:this.pagoForm.numeroAutorizacion ? this.pagoForm.numeroAutorizacion : '',
        tipo_pago: parseInt(this.pagoForm.tipoPago),
        valor_pagado: this.pagoForm.valorPago ? parseFloat(this.pagoForm.valorPago.replace('$','').replace('.','')) : 0,
        dias_pagados: parseInt(this.pagoForm.diasPago ? this.pagoForm.diasPago : 0),
        causal_dias: this.pagoForm.causalDiasPago != null && this.pagoForm.causalDiasPago != '' ? parseInt(this.pagoForm.causalDiasPago) : 0,
        fecha_pago: this.pagoForm.fechaPago ? this.pagoForm.fechaPago : this.getFormattedDateTime(new Date()),
        ibc_pago: this.pagoForm.ingresoBaseCotizacion ? parseFloat(this.pagoForm.ingresoBaseCotizacion.replace('$','').replace('.','')): 0,
        tipo_documento_aportante: this.pagoForm.tipoDocumentoAportante,
        numero_documento_aportante: this.pagoForm.numeroDocumentoAportante,
        razon_social_aportante: this.pagoForm.razonSocialAportante,
        //Se asigna la entidad responsable de pago
        entidad_responsable_pago: perfil[0].codigoEntidad,
        //Se crear id usuario hercules
        id_usuario_hercules: perfilUbicacion.idUsuarioEntidadRol,
        reporte_servicio_web:1,
        buscado_pila:1,
        ibc_pila:1,
        periodo_salud_pila:1,
        descripcion_estado_pago: elemento_estado_pago.descripcion,
        descripcion_tipo_pago: elemento_tipo_pago ? elemento_tipo_pago.descripcion : '',
        descripcion_causal_glosa: elemento_causal_glosa ? elemento_causal_glosa.descripcion : '',
        descripcion_causal_dias: elemento_causal_dias ? elemento_causal_dias.descripcion : '',
        tipo_documento_pac: this.incapacidadResumen.tipo_documento_pac,
        numero_documento_pac: this.incapacidadResumen.numero_documento_pac,      
        primer_nombre_pac: this.incapacidadResumen.primer_nombre_pac,
        segundo_nombre_pac: this.incapacidadResumen.segundo_nombre_pac,
        primer_apellido_pac: this.incapacidadResumen.primer_apellido_pac,
        segundo_apellido_pac: this.incapacidadResumen.segundo_apellido_pac,
        //Se agrega registro pago
        fecha_registro_pago: new Date(),

      }  

      //console.log(this.pagoModel.tipo_documento_aportante)
      //console.log(this.pagoModel.numero_documento_aportante)

      this.next();
    }

    async guardarPago(){

      this.pagoForm = this.formInformePagoIncapacidad.value;
      this.submittedPago = true;

      // stop here if form is invalid
      if (this.formInformePagoIncapacidad.invalid) {
        return;
      }

      

      // const pago = {
      //   id_incapacidad : '1234569874',
      //   fecha_radicacion : '2022-09-30',
      //   estado_pago: 1,
      //   causal_glosa:pagoForm.causalGlosa = 1,
      //   nro_autorizacion: "Tipo 1",
      //   tipo_pago: 1,
      //   valor_pagado: 1,
      //   dias_pagados: 1,
      //   causal_dias: 1,
      //   fecha_pago: '2022-09-30',
      //   ibc_pago: 1,
      //   entidad_responsable_pago:'',
      //   id_usuario_hercules:1,
      //   reporte_servicio_web:1,
      //   buscado_pila:1,
      //   ibc_pila:1,
      //   periodo_salud_pila:1
      // }

      let result = await this.parametrosIncapacidadesService.guardarDatosPagoIncapacidad(this.pagoModel); 
      
      if(result!= null && result == '1'){
          this.registroExitoso = true;
          window.scrollTo(0, 0);
      }else{
          this.Alertas.alertaInformativa('', 'Error al guardar el registro de pago', 'Cerrar');
      }
      
    }

    refresh(): void { 
      location.href = this.baseUrlSIIN + '/incapacidades/pago-incapacidad'
    }

    inicializarIncapacidad(){
      return {
        tipo_documento_pac:'',
        numero_documento_pac: '',
        id_incapacidad: 0,
        paciente_encontrado: false,
        primer_nombre_pac:'',
        segundo_nombre_pac:'',
        primer_apellido_pac:'',
        segundo_apellido_pac:'',
        sexo_pac:'',
        edad_pac:0,
      
        codigo: '',
        nombre: '',
        
        diagnostico_principal: '',
        diagnostico_relacion_1: '',
        diagnostico_relacion_2: '',
      
        id_servicio: 0,
        id_finalidad: 0,
        id_modalidad: 0,
        retroactiva: false,
        id_retroactiva: 0,
        id_trastorno_memoria: 0,
        id_origen: 0,
        id_causa :0,
      
        fecha_inicio_string: '',
        fecha_fin_string: '',
      
        fecha_inicio: new Date ,
        fecha_fin: new Date,
        dias_incapacidad: '',
      
        lugar_expedicion: '',
        lugar_expedicion_descripcion: '',
        fecha_expedicion: null,
        
        prorroga: false,
        dias_acumulados_prorroga: 0,
        fecha_nacimiento_pac: '',
      
      
        codigo_diagnostico_principal: '',
        codigo_diagnostico_relacion_1: '',
        codigo_diagnostico_relacion_2: '',

        tipoDocumento : {
          cod_tipo_documento : '',
          descripcion : ''
        },
        diagnostico : {
          cod_diagnostico : ''
        },
        diagnosticoRelacionUno : null,
        diagnosticoRelacionDos : {
          cod_diag_relacion_dos : ''
        },
        origen : {
          descripcion : ''
        },
        causaAtencion : {
          descripcion : ''
        }

      };
    }

    // public getFormattedDate(date: Date) : string {
    //   var year = date.getFullYear();
    
    //   var month = (1 + date.getMonth()).toString();
    //   month = month.length > 1 ? month : '0' + month;
    
    //   var day = date.getDate().toString();
    //   day = day.length > 1 ? day : '0' + day;
      
    //   return year + '-' +  month + '-' + day;
    // }
  
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


    /*********** Modal Aportantes **************/
  async openModalAportantes(){
    
    
    const modalRef = this.modalService.open(ModalAportantesPagoComponent, this.optionsModal);

    modalRef.componentInstance.dataIn = {
        name: '', 
        id: 0, 
        relacionesPacienteAportante : this.listaRelacionPacienteAportante//this.paciente.relacionesPacienteAportante
      };     
    await modalRef.result.then(async (result) => {
      console.log(result)
        this.f_aportante.tipoDocumentoAportante.setValue(result.tipo_documento_ap);
        this.f_aportante.numeroDocumentoAportante.setValue(result.numero_documento_ap);
        this.f_aportante.razonSocialAportante.setValue(result.razon_social_descripcion);
    });
  } 

}


