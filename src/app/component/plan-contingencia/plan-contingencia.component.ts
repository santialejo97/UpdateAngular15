import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import {Router} from '@angular/router';
import { FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { AlertasService } from 'src/app/services/alertas.service';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { formatDate } from '@angular/common';
import { Observable, from, of } from 'rxjs';
import { ConfirmDialogComponent } from './confirmdialog/ConfirmDialogComponent';
import { catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plan-contingencia',
  templateUrl: './plan-contingencia.component.html',
  styleUrls: ['./plan-contingencia.component.scss']
})

export class PlanContingenciaComponent implements OnInit {

  formPlanContingencia: FormGroup;
  perfilUbicacion: IPerfilComple;
  perfilEntidad: IPerfil;
  submittedContingencia = false;
  listaPlanContingencia: any;
  nombreCausal: string; 
  fechaHoy: Date;
  fechaMinimaIncapacidad: number = Date.now();
  listaCausalContingencia: any;
  consultaPlanContingenciaActual: any;

  private stepper: Stepper; 

  constructor(private fb: FormBuilder,
      private parametrosIncapacidadesService: ParametrosIncapacidadesService,
      private Alertas: AlertasService,
      private router: Router,
      private ngbModal: NgbModal
      ) {      
        this.formPlanContingencia = this.fb.group({
          id: [0,],
          causal: ['', Validators.required ],
          fechaInicio: ['',  Validators.required ],
          fechaFin: [{ value: null, disabled: true }, Validators.required],  
          fechaRegistro: ['',]   
        });
  }

  ngOnInit() {
      this.stepper = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true })

      this.perfilUbicacion = JSON.parse(localStorage.getItem('complementario2')) || '';
      this.perfilEntidad = JSON.parse(localStorage.getItem('complementario')) || '';

      this.cargarDatos();
  }

  async cargarDatos(){ 

      this.cargarListaCausalContingencia();
      
      const fechaServActual = await this.parametrosIncapacidadesService.get('/utilidades'); 
      this.fechaHoy = new Date(formatDate(fechaServActual.fechaActual, 'yyyy-MM-ddTHH:mm:ss', 'en'));
      this.f_planContingencia.fechaRegistro.setValue(new Date(formatDate(fechaServActual.fechaActual, 'yyyy-MM-ddTHH:mm:ss', 'en')));

      this.consultaPlanContingenciaActual  = await this.consultarPlanContingenciaExistente();

      //Validar existencia de plan contingencia
      if(this.consultaPlanContingenciaActual == null){
        //Si no existe plan se desactiva la fecha fin
        this.f_planContingencia.fechaFin.disable();
      }else{
        this.f_planContingencia.fechaFin.enable();

        this.formPlanContingencia.patchValue({
          id: this.consultaPlanContingenciaActual.id,
          causal: this.consultaPlanContingenciaActual.causal,
          fechaInicio: this.consultaPlanContingenciaActual.fecha_inicio,
          fechaFin: this.consultaPlanContingenciaActual.fecha_fin,  
          fechaRegistro: this.consultaPlanContingenciaActual.fecha_registro })
      }

  }

  cargarListaCausalContingencia() {
      this.listaCausalContingencia = [
        {
          "id": 1,
          "causal": "Dificultades técnicas"
        
        },
        {
          "id": 2,
          "causal": "Problemas eléctricos"
        },
        {
          "id": 3,
          "causal": "Problemas de conectividad"
        },
        {
          "id": 4,
          "causal": "Problemas de orden público"
        },
        {
          "id": 5,
          "causal": "Catástrofes naturales."
        },
    
      ]  
  }

  Nuevo(){
      this.router.navigate(['add']);
  }

  next() {
      this.stepper.next();  
  }

  goBack(){
      this.stepper.previous();  
  }
  
  goBackMenu(){
      this.router.navigate(['/menu-principal']);
  }

  refresh(): void {
      location.href = 'incapacidades/plan-contingencia/'
  }

  // convenience getter for easy access to form fields
  get f_planContingencia() { return this.formPlanContingencia.controls; }


  async RegistrarPlanContingencia(){
      this.submittedContingencia = true;
      if (this.formPlanContingencia.valid) {

          var fechaInicioValidacion = new Date(formatDate(this.f_planContingencia.fechaInicio.value, 'yyyy-MM-ddTHH:mm:ss', 'en'));          
          
          if(this.f_planContingencia.fechaFin.value != null && this.f_planContingencia.fechaFin.value != '')
          {
              var fechaFinValidacion = new Date(formatDate(this.f_planContingencia.fechaFin.value, 'yyyy-MM-ddTHH:mm:ss', 'en'))
              if(fechaInicioValidacion >=  fechaFinValidacion){
                  await this.Alertas.alertaInformativa('', 'Las fechas inicial o final de la contingencia son inconsistentes. la fecha de inicio debe ser menor a la fecha final.', 'Cerrar');
                  return;
              }

              if(fechaFinValidacion >=  this.fechaHoy){
                await this.Alertas.alertaInformativa('', 'Las fechas inicial o final de la contingencia son inconsistentes. la fecha final debe ser menor o igual a la del sistema.', 'Cerrar');
                return;
              }
          }

          const lista = this.listaCausalContingencia.filter(causalLista =>causalLista.id == this.f_planContingencia.causal.value );
          this.nombreCausal = lista[0].causal;
          this.next();
        
      }
   }

   async ConfirmarDatos(){ 
      if (this.formPlanContingencia.valid) {
        (await this.confirmarOperacion("Se registrará contingencia para la entidad ", "Actualizar")).subscribe(valid=>{
          if(valid){
            this.guardarContingencia();
          }
        });
      }
   }

   async guardarContingencia(){
    const valuesParam = 
          {
            'id' : this.f_planContingencia.id.value,
            'causal' : parseInt(this.f_planContingencia.causal.value),
            'fecha_inicio' : this.f_planContingencia.fechaInicio.value,
            'fecha_fin' : this.f_planContingencia.fechaFin.value,
            'fecha_registro' : this.f_planContingencia.fechaRegistro.value,
            'id_entidad' : this.perfilUbicacion.idEntidad,
            'id_usuario_entidad_rol' : this.perfilUbicacion.idUsuarioEntidadRol      
          };

        const respuestainsertarPlanContigencia = await this.parametrosIncapacidadesService.postIncapacidad('/Incapacidad/CrearPlanContingencia', valuesParam);
        console.log(respuestainsertarPlanContigencia)
        if(respuestainsertarPlanContigencia.error == ''){
          this.next();
          this.consultaPlanContingenciaActual  = await this.consultarPlanContingenciaExistente();
        }else{
          await this.Alertas.alertaInformativa('', 'Se presento un problema al momento de crear el plan de contingencia ', 'Cerrar');
          return;
        }
   }

   async confirmarOperacion(prompt = 'Really?', title = 'Confirm'): Promise<Observable<boolean>> {
    const modal = this.ngbModal.open(
      ConfirmDialogComponent, { backdrop: 'static' });

    modal.componentInstance.prompt = prompt;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  async consultarPlanContingenciaExistente() {
    let valuesParam = {
      id_entidad: this.perfilUbicacion.idEntidad,
      fecha_registro: this.f_planContingencia.fechaRegistro.value
    };
  
    this.consultaPlanContingenciaActual  = await this.parametrosIncapacidadesService.postIncapacidad('/Incapacidad/ConsultaPlanContingencia', valuesParam);
    console.log(this.consultaPlanContingenciaActual)
    return this.consultaPlanContingenciaActual;
  }

}





