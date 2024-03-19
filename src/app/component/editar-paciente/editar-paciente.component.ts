import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { IPacienteModel } from 'src/app/models/paciente.model';
import {NgbModal,NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacionPacienteComponent } from './modal-confirmacion-paciente/modal-confirmacion-paciente.component';
import { NotificationesService } from 'src/app/services/notificaciones.service';
import { formatDate } from '@angular/common';
import { AlertasService } from 'src/app/services/alertas.service';
import { LoggingService } from 'src/app/services/logging.service';



@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.scss']
})
export class EditarPacienteComponent implements OnInit {
  @Input() public pacienteIn:IPacienteModel;
  @Output () valueResponse: EventEmitter<string> = new EventEmitter();
  @Input() public pacienteOut:IPacienteModel;
  //@Input() public deshabilitar:boolean;

  deshabilitar:boolean;
  listaRegimen:any;
  listaMunicipios:any;
  listaDepartamentos:any;
  listaSexo:any;
  //listaAdministradoras:any;
  listaTipoDocumento: any;
  listaMunicipiosByDepto:any;
  listaAdministradorasByCodRegimen:any;
  fechaMinimaNacimiento: Date;//'1900-01-02';
  tieneRegimen: boolean = false;
  maxDate = new Date(Date.now());
  //startDate: Date;

  optionsModal: NgbModalOptions = {
    size: 'lg',
    backdrop:'static',
    backdropClass: "light-blue-backdrop",
    windowClass: 'dark-modal',
    centered: true
  };


  pacienteForm: FormGroup; 
  submittedPaciente = false;

  constructor(private parametrosIncapacidadesService: ParametrosIncapacidadesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private notification: NotificationesService,
    private Alertas: AlertasService,
    private loggingService: LoggingService
    ) { 
  }

  async ngOnInit(){

    var minDate = new Date(Date.now());
    minDate.setFullYear(minDate.getFullYear()-122);
    minDate.setDate(minDate.getDate()+1);
    this.fechaMinimaNacimiento = minDate;
    //this.loggingService.registroLog(this.fechaMinimaNacimiento);

    this.createPacienteForm();
    this.cargarListas(); 
  }

  ngOnChanges(){
  
  }

  
  /*** Formulario buscar paciente *****/
  createPacienteForm() {

    //let fechaNacimiento =  new Date();
    // new Date(this.getFormattedDateEstandar(this.pacienteIn.fecha_nacimiento_string));
    this.pacienteForm = this.formBuilder.group({
      tipo_documento: [{value: this.pacienteIn.tipo_documento, disabled: true,}],
      numero_documento: [{value: this.pacienteIn.numero_documento, disabled: true} ],
      primer_nombre: [{value: this.pacienteIn.primer_nombre, disabled: this.deshabilitar}, Validators.required ],
      segundo_nombre: [{value: this.pacienteIn.segundo_nombre, disabled: this.deshabilitar}],
      primer_apellido: [{value: this.pacienteIn.primer_apellido, disabled: this.deshabilitar}, Validators.required ],
      segundo_apellido: [{value: this.pacienteIn.segundo_apellido, disabled: this.deshabilitar} ],
      sexo: [{value: this.pacienteIn.sexo, disabled: this.deshabilitar}, Validators.required ],
      //fecha_nacimiento_string: [this.getFormattedDate(fechaNacimiento), Validators.required ],
      //fecha_nacimiento_string: [this.pacienteIn.fecha_nacimiento_string, Validators.required ],
      //fecha_nacimiento: [{value: formatDate(this.pacienteIn.fecha_nacimiento, 'dd-MM-yyyy', 'es'), disabled: this.deshabilitar},Validators.required ],      
      fecha_nacimiento: [{value: this.pacienteIn.fecha_nacimiento, disabled: this.deshabilitar},Validators.required ],
      cod_depto_residencia: [{value: this.pacienteIn.cod_depto_residencia, disabled: this.deshabilitar}, Validators.required ],
      cod_mun_residencia: [{value: this.pacienteIn.cod_mun_residencia, disabled: this.deshabilitar}, Validators.required ],
      id_regimen: [{value: this.pacienteIn.id_regimen, disabled:  this.deshabilitar}, Validators.required ],
      regimen_descripcion: [''],
      eps: [{value: this.pacienteIn.eps, disabled:  this.deshabilitar} , Validators.required ],
      descripcion_departamento: [''],
       /*razon_social: [{value: this.pacienteIn.razon_social, disabled: this.deshabilitar}, Validators.required  ],
       tipo_documento_empleador: [{value: this.pacienteIn.tipo_documento_empleador, disabled:this.deshabilitar} , Validators.required ],
       numero_documento_empleador: [{value: this.pacienteIn.numero_documento_empleador, disabled:this.deshabilitar}, Validators.required  ],
       ubicacion_empleador: [{value: this.pacienteIn.ubicacion_empleador, disabled: this.deshabilitar}, Validators.required ],*/
      tieneregimen:  [false],
      //date: new FormControl('08/01/2019')
    });

    //this.pacienteForm.get('fecha_nacimiento').patchValue(this.pacienteIn.fecha_nacimiento/*this.getFormattedDate(this.pacienteIn.fecha_nacimiento)*/);
    //this.startDate = new Date(this.pacienteForm.get('date').value);

  }

  dateChangeHandler(date: Date){
    //const stringDate: string = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+${date.getDay()+ 1}};
    //this.pacienteForm.get('fecha_nacimiento').setValue(stringDate)

    //var a =this.getFormattedDate(date);
    //var d = new Date(a)
    //date.setDate(date.getDate()-1)
    this.pacienteForm.get('fecha_nacimiento').patchValue(date);
  }

  ActualizarValoresdeHabilitacion(){

    if(this.deshabilitar == false){
      this.f_paciente.tipo_documento.enable();
      this.f_paciente.numero_documento.enable();
      
      this.f_paciente.primer_nombre.enable();
      this.f_paciente.segundo_nombre.enable();
      this.f_paciente.primer_apellido.enable();
      this.f_paciente.segundo_apellido.enable();
      this.f_paciente.sexo.enable();
      this.f_paciente.fecha_nacimiento.enable();

      this.f_paciente.id_regimen.enable();
      this.f_paciente.eps.enable();
      /*this.f_paciente.razon_social.enable();
      
      this.f_paciente.tipo_documento_empleador.enable();
      this.f_paciente.numero_documento_empleador.enable();
      this.f_paciente.ubicacion_empleador.enable();*/
      this.f_paciente.cod_depto_residencia.enable();
      this.f_paciente.cod_mun_residencia.enable();

    }else{

      this.f_paciente.tipo_documento.disable();
      this.f_paciente.numero_documento.disable();

      this.f_paciente.primer_nombre.disable();
      this.f_paciente.segundo_nombre.disable();
      this.f_paciente.primer_apellido.disable();
      this.f_paciente.segundo_apellido.disable();
      this.f_paciente.sexo.disable();
      this.f_paciente.fecha_nacimiento.disable();

      this.f_paciente.id_regimen.disable();
      this.f_paciente.eps.disable();
      /*this.f_paciente.razon_social.disable();
       
      this.f_paciente.tipo_documento_empleador.disable();
      this.f_paciente.numero_documento_empleador.disable();
      this.f_paciente.ubicacion_empleador.disable();*/
      this.f_paciente.cod_depto_residencia.disable();
      this.f_paciente.cod_mun_residencia.disable();   
     }

    this.tieneRegimen = false;
    
  }

  async ActualizarValoresFormulario(pac:IPacienteModel){
    
    this.pacienteForm.patchValue(pac);
    //this.pacienteForm.get('fecha_nacimiento').patchValue(this.getFormattedDate(pac.fecha_nacimiento));
    
    if(this.listaMunicipios){
      this.listaMunicipiosByDepto = this.listaMunicipios.filter(x => x.cod_depto == this.f_paciente.cod_depto_residencia.value); 
    }

    //this.loggingService.registroLog(this.f_paciente.id_regimen.value );
    if(this.f_paciente.id_regimen.value){
      this.listaAdministradorasByCodRegimen = await this.parametrosIncapacidadesService.get('/Administradoras?codRegimen=' + this.f_paciente.id_regimen.value + '&tipoAdministradora=');
    }
    
    this.loggingService.registroLog(this.listaAdministradorasByCodRegimen );
    this.loggingService.registroLog('listaAdministradoras cargada con exito');
  }

  get f_paciente() { return this.pacienteForm.controls; }
  


  /*async InsertarPaciente(modeloPaciente: IPacienteModel){     
    
    this.submittedPaciente = true;
    
    // stop here if form is invalid
    if (this.pacienteForm.invalid) {
        return;
    }
    this.loggingService.registroLog(modeloPaciente);
    let result = await this.parametrosIncapacidadesService.post('/pacientenoencontrado', modeloPaciente);
    this.loggingService.registroLog(result);
    if(result !=null && result.id_pacienteNoEncontrado !=0){
      this.notification.showSuccess('Paciente Registrado con éxito',"");
      this.valueResponse.emit();
    }
    else{
      this.notification.showError('Paciente No Registrado',"");
      this.loggingService.registroLog(result);    }
    

  }

 /*********** Eventos selects ********/

async abrirModalConfirmacionPaciente(modeloPaciente: IPacienteModel) { 

    this.submittedPaciente = true; 

    this.loggingService.registroLog(modeloPaciente);
    
    // stop here if form is invalid
    if (this.pacienteForm.invalid) {
        return;
    }

    var minDate = new Date(Date.now());
    minDate.setFullYear(minDate.getFullYear()-122);
    minDate.setDate(minDate.getDate());
    var minDate = new Date(this.getFormattedDate(minDate))

    if(minDate.getTime() > modeloPaciente.fecha_nacimiento.getTime()){
      await this.Alertas.alertaInformativa('Advertencia','La fecha de nacimiento no puede ser anterior a ' + this.getFormattedDateEstandar(this.getFormattedDate(minDate)) ,'Cerrar');
      return;
    }

    //datos adicionales obtenidos de las listas y modelos para informacion paciente
    let RegimenEncontrado = this.listaRegimen.find(function(element) {
      return element.cod_regimen == modeloPaciente.id_regimen;
      })

      let sexoEncontrado = this.listaSexo.find(function(element) {
      return element.cod_sexo == modeloPaciente.sexo;
    })

    let ciudadEncontrado = this.listaMunicipios.find(function(element) {
      return element.cod_municipio == modeloPaciente.cod_mun_residencia && element.cod_depto == modeloPaciente.cod_depto_residencia;
    })

    let departamentoEncontrado = this.listaDepartamentos.find(function(element) {
      return element.cod_depto == modeloPaciente.cod_depto_residencia;
    })

    let administradoraEncontrada = this.listaAdministradorasByCodRegimen.find(function(element) {
      return element.cod_administradora == modeloPaciente.eps;
    })

    this.pacienteIn.regimen_descripcion = (RegimenEncontrado!= null) ? RegimenEncontrado.descripcion : '';
    this.pacienteIn.sexo_descripcion = (sexoEncontrado!= null) ? sexoEncontrado.descripcion : '';
    this.pacienteIn.ciudad_residencia_descripcion = (ciudadEncontrado!= null) ? ciudadEncontrado.nom_ciudad : '';
    this.pacienteIn.depto_residencia_descripcion = (departamentoEncontrado!= null) ? departamentoEncontrado.nom_depto : '';
    this.pacienteIn.eps_nombre = (administradoraEncontrada!= null) ? administradoraEncontrada.razon_social : '';

    this.pacienteIn.numero_documento= this.f_paciente.numero_documento.value;
    this.pacienteIn.tipo_documento= this.f_paciente.tipo_documento.value;
    this.pacienteIn.primer_nombre= this.f_paciente.primer_nombre.value.trim();
    this.pacienteIn.segundo_nombre= this.f_paciente.segundo_nombre.value.trim();
    this.pacienteIn.primer_apellido= this.f_paciente.primer_apellido.value.trim();
    this.pacienteIn.segundo_apellido= this.f_paciente.segundo_apellido.value.trim();

    let fechaNacimientoAux = new Date(this.f_paciente.fecha_nacimiento.value);
    fechaNacimientoAux.setDate(fechaNacimientoAux.getDate());;
    this.pacienteIn.fecha_nacimiento = fechaNacimientoAux
    this.pacienteIn.fecha_nacimiento_string  = this.getFormattedDate(fechaNacimientoAux);

    this.pacienteIn.eps= this.f_paciente.eps.value;

    this.pacienteIn.sexo = this.f_paciente.sexo.value;
    this.pacienteIn.cod_depto_residencia = this.f_paciente.cod_depto_residencia.value;
    this.pacienteIn.cod_mun_residencia = this.f_paciente.cod_mun_residencia.value;
    this.pacienteIn.id_regimen = this.f_paciente.id_regimen.value;

    /*this.pacienteIn.razon_social= this.f_paciente.razon_social.value;
    this.pacienteIn.tipo_documento_empleador= this.f_paciente.tipo_documento_empleador.value;
    this.pacienteIn.numero_documento_empleador= this.f_paciente.numero_documento_empleador.value;
    this.pacienteIn.ubicacion_empleador= this.f_paciente.ubicacion_empleador.value;*/

      const modalRef = this.modalService.open(ModalConfirmacionPacienteComponent,this.optionsModal);
      modalRef.componentInstance.dataIn = {name: '', id: 0, 'incapacidad_data':this.pacienteForm.value, 'paciente_data': this.pacienteIn};
      modalRef.result.then(async (result) => {
          this.loggingService.registroLog(result)

          if(result.resultado == 'si'){

            //await this.InsertarPaciente( modeloPaciente);
            //this.pacienteOut = modeloPaciente;
            this.pacienteOut = this.pacienteIn;
            //this.notification.showSuccess('La información del paciente se almacenará',"");
            this.valueResponse.emit();          
          
        }else{
          this.loggingService.registroLog('no confirmado')
        }
      }
      );
  
 }


  
 public changeValueTipoDocumento() {
  this.loggingService.registroLog('change select')
  }
  
  // public changeRegimenConsulta() {
  //   this.loggingService.registroLog(this.f_paciente.id_regimen.value)
  //   if(this.f_paciente.id_regimen.value== 'C'){
  //     this.tieneRegimen = true;

  //     this.f_paciente.eps.enable();
  //    /* this.f_paciente.razon_social.enable();
  //     this.f_paciente.tipo_documento_empleador.enable();
  //     this.f_paciente.numero_documento_empleador.enable();
  //     this.f_paciente.ubicacion_empleador.enable();*/
      
  //   }
  //   else{
  //     this.tieneRegimen = false;
  //     //El setValue sirve para modificar el valor desde el código
  //     this.f_paciente.eps.setValue('');
  //     /*this.f_paciente.razon_social.setValue('');
  //     this.f_paciente.tipo_documento_empleador.setValue('');
  //     this.f_paciente.numero_documento_empleador.setValue('');
  //     this.f_paciente.ubicacion_empleador.setValue('');*/

  //     this.f_paciente.eps.disable();
  //     /*this.f_paciente.razon_social.disable();
  //     this.f_paciente.ubicacion_empleador.disable();
  //     this.f_paciente.tipo_documento_empleador.disable();
  //     this.f_paciente.numero_documento_empleador.disable();*/
     
  //   }
  // }

  public changeSexoConsulta() {
    this.loggingService.registroLog('change select')
  }

  public changeDepartamentosConsulta(e) {
    this.listaMunicipiosByDepto = this.listaMunicipios.filter(x => x.cod_depto == this.f_paciente.cod_depto_residencia.value); 
  }

  public changeMunicipiosConsulta(e) {
    this.loggingService.registroLog('change select')
  }

  refresh(): void { 
    window.location.reload(); 
  }

  public async changeRegimen(e) {
    // this.listaAdministradorasByCodgimen = this.listaAdministradorasByCodRegimen.filter(x => x.cod_regimen == this.f_paciente.id_regimen.value); 
    this.listaAdministradorasByCodRegimen = await this.parametrosIncapacidadesService.get('/Administradoras?codRegimen=' + this.f_paciente.id_regimen.value + '&tipoAdministradora=');
    this.loggingService.registroLog('listaAdministradoras cargada con exito');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async cargarListas() {  

    await this.sleep(7000);
        
    this.listaTipoDocumento = await this.parametrosIncapacidadesService.get('/tipodocumento');
    this.loggingService.registroLog('listaTipoDocumento cargada con exito');      
     
    this.listaRegimen = await this.parametrosIncapacidadesService.get('/regimen');
    this.loggingService.registroLog('listaRegimen cargada con exito');

    this.listaDepartamentos = await this.parametrosIncapacidadesService.get('/departamentos');
    this.loggingService.registroLog('listaDepartamentos cargada con exito');

    this.listaMunicipios = await this.parametrosIncapacidadesService.get('/municipios');
    this.listaMunicipiosByDepto = this.listaMunicipios.filter(x => x.cod_depto == this.f_paciente.cod_depto_residencia.value); 
    this.loggingService.registroLog('listaMunicipios cargada con exito');
    
    this.listaSexo = await this.parametrosIncapacidadesService.get('/sexo');
    this.loggingService.registroLog('listaSexo cargada con exito');

    // this.listaAdministradoras = await this.parametrosIncapacidadesService.get('/administradoras');
    // this.listaRegimenByCod = this.listaRegimen.filter(x => x.cod_regimen == this.f_paciente.cod_regimen.value); 
    // this.loggingService.registroLog('listaAdministradoras cargada con exito');
    //this.loggingService.registroLog(this.listaAdministradoras)

  }


/************* Funciones generales *****************/
public getFormattedDate(date: Date) : string {
  
  if(date == null){
    return '';
  }

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return year + '-' +  month + '-' + day;
}

  public getFormattedDateEstandar(dateString: string) : string {
    return dateString.split('-')[2] + '/' +  dateString.split('-')[1] + '/' + dateString.split('-')[0];
  }


}
