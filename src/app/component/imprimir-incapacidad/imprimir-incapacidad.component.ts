import { Component, Input, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { IPacienteModel } from 'src/app/models/paciente.model';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { NotificationesService } from 'src/app/services/notificaciones.service';


import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { DownloadService } from 'src/app/services/download.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-imprimir-incapacidad',
  templateUrl: './imprimir-incapacidad.component.html', 
  styleUrls: ['./imprimir-incapacidad.component.scss']
})
export class ImprimirIncapacidadComponent implements OnInit {
  name = 'Angular';

  private stepper: Stepper;
  listaTipoDocumento: any;

  //paciente : IPacienteModel;
  incapacidadResumen: any;
  submittedImprimir = false;
  showCountryErrorMessage: boolean = false;
  formInfomeIncapacidad: FormGroup;
  // IncapacidadResumen : any;
  error : any;
  listaIncapacidadesAnteriores: any;
  mostrarResultados: boolean;
 
    constructor(private parametrosIncapacidadesService: ParametrosIncapacidadesService, private downloadService: DownloadService,
    private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder,
    private notificacionService: NotificationesService,
    
    ) {
      
      this.notificacionService.showError('','');
      
      this.incapacidadResumen =  this.inicializarIncapacidad();

      console.log(this.incapacidadResumen.tipoDocumento)
      this.createInformeForm();
    }


    next() {
      this.stepper.next();
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
        linear: false,
        animation: true })
      
      this.cargarListas(); 
    }

    createInformeForm() {
      this.formInfomeIncapacidad = this.formBuilder.group({
        tipoDocumento: [{value: 'CC', disabled: false}, Validators.required ],
        numeroDocumento: [{value: '', disabled: false}, Validators.required ],
        numeroIncapacidad: [{value: '', disabled: false}, Validators.required ]
      });
    }

    // convenience getter for easy access to form fields
    get f_informe() { return this.formInfomeIncapacidad.controls; }


    deshabilitarValidaciones(){

      
      if(this.f_informe.numeroIncapacidad.value != ''){       
        this.f_informe.tipoDocumento.setValidators(null);
        this.f_informe.numeroDocumento.setValidators(null);
        this.f_informe.numeroIncapacidad.setValidators(Validators.required);
      }else if (this.f_informe.numeroDocumento.value != ''){        
        this.f_informe.tipoDocumento.setValidators(Validators.required);
        this.f_informe.numeroDocumento.setValidators(Validators.required);
        this.f_informe.numeroIncapacidad.setValidators(null);        
      }else{
        this.f_informe.tipoDocumento.setValidators(Validators.required);
        this.f_informe.numeroDocumento.setValidators(Validators.required);
        this.f_informe.numeroIncapacidad.setValidators(Validators.required);       
      }      
      
      this.f_informe.tipoDocumento.updateValueAndValidity();
      this.f_informe.numeroDocumento.updateValueAndValidity();
      this.f_informe.numeroIncapacidad.updateValueAndValidity();
    }

    async buscarIncapacidadesAnteriores() : Promise<any> {

      this.deshabilitarValidaciones();
      this.submittedImprimir = true;

      // stop here if form is invalid
      if (this.formInfomeIncapacidad.invalid) {
          return;
      }

      let valuesParam = {
                          tipo_documento_pac : this.f_informe.tipoDocumento.value, 
                          numero_documento_pac: this.f_informe.numeroDocumento.value, 
                          id_incapacidad: this.f_informe.numeroIncapacidad.value, 
                          id_usuario_hercules: 1,
                          filtroUltimos30dias: true,
                          excluirAnuladas : false};
      this.listaIncapacidadesAnteriores = await this.parametrosIncapacidadesService.postIncapacidad('/Incapacidad/ConsultaPorPaciente', valuesParam);
      
      console.log('this.listaIncapacidadesAnteriores');
      console.log(this.listaIncapacidadesAnteriores);
      this.mostrarResultados = true;
    }

    async buscarInformeIncapacidad(incapacidadIndex){

      const incapacidad: any = {
        numeroIncapacidad: this.listaIncapacidadesAnteriores[incapacidadIndex].id_incapacidad,
        tipoDocumento: this.listaIncapacidadesAnteriores[incapacidadIndex].tipo_documento_pac,
        numeroDocumento: this.listaIncapacidadesAnteriores[incapacidadIndex].numero_documento_pac 
      }
    
      await this.parametrosIncapacidadesService.getIncapacidadAnular('/Incapacidad', incapacidad.numeroIncapacidad,   
      incapacidad.tipoDocumento, incapacidad.numeroDocumento).subscribe(data => {
        
        this.incapacidadResumen = data;
        console.log(this.incapacidadResumen);   
        this.next();
      },error => this.error = error);
          
    }

    BotonGeneracionPDF(){
      this.generarPDF();
    }

    async generarPDF(){
      let valuesParam = { tipo_documento_pac : this.incapacidadResumen.tipoDocumento.cod_tipo_documento, 
      numero_documento_pac:this.incapacidadResumen.numero_documento_pac, id_usuario_hercules: 1, id_incapacidad:this.incapacidadResumen.id_incapacidad };
      this.downloadFile(valuesParam,'certificado' + this.incapacidadResumen.id_incapacidad + '.pdf');
    }

    downloadFile(params:any, filename: string): void {
      this.downloadService
        .download(params,filename)
        .subscribe(blob => FileSaver.saveAs(blob, filename));
    }

    
    async cargarListas() {      
      this.listaTipoDocumento = await this.parametrosIncapacidadesService.get('/tipodocumento');
      console.log('listaTipoDocumento cargada con exito');  
      this.spinnerService.hide('spinnerCargaInicial');   
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

}
