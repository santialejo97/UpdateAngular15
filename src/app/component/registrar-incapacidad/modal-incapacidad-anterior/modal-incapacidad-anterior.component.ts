import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-incapacidad-anterior',
  templateUrl: './modal-incapacidad-anterior.component.html',
  styleUrls: ['./modal-incapacidad-anterior.component.scss']
})
export class ModalIncapacidadAnteriorComponent implements OnInit {

  @Input() public dataIn :any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  fechaInicioAnterior: Date;
  fechaFinAnterior: Date;

  fechaInicioActual: Date;
  fechaFinActual: Date;

  fechaInicioNueva: Date;
  fechaFinNueva: Date;

  nuevosDiasIncapacidad: number;
  acumulaDias: boolean;
  
  constructor(
    public activeModal: NgbActiveModal
  ) { 
  }

  ngOnInit() {

    console.log('this.dataIn.lista_incapacidades modal');
    console.log(this.dataIn.lista_incapacidades);
    
    this.fechaInicioAnterior = new Date(this.dataIn.lista_incapacidades[0].fecha_inicio_string);
    this.fechaInicioAnterior.setDate(this.fechaInicioAnterior.getDate() + 1); //sumar 1 dia por la conversion

    this.fechaFinAnterior = new Date(this.dataIn.lista_incapacidades[0].fecha_fin_string);
    this.fechaFinAnterior.setDate(this.fechaFinAnterior.getDate() + 1); //sumar 1 dia por la conversion

    this.fechaInicioActual = new Date(this.dataIn.incapacidad_data.fecha_inicio_string);
    this.fechaInicioActual.setDate(this.fechaInicioActual.getDate() + 1); //sumar 1 dia por la conversion

    this.fechaFinActual = new Date(this.dataIn.incapacidad_data.fecha_fin_string);
    this.fechaFinActual.setDate(this.fechaFinActual.getDate() + 1); //sumar 1 dia por la conversion

    this.fechaInicioNueva = new Date(this.dataIn.lista_incapacidades[0].fecha_fin_string);
    this.fechaInicioNueva.setDate(this.fechaInicioNueva.getDate() + 2); //sumar 1 dia por la conversion (y uno mas para el calculo)

    this.fechaFinNueva = new Date(this.dataIn.incapacidad_data.fecha_fin_string);
    this.fechaFinNueva.setDate(this.fechaFinNueva.getDate() + 1); //sumar 1 dia por la conversion
    
    //traslape que requiere nuevo calculo de fechas y dias  (La fecha fin actual es mayor a la fecha fin de la anterior)
    if(this.fechaFinActual.getTime() > this.fechaInicioNueva.getTime()){
      var diff = this.fechaFinActual.getTime() - this.fechaInicioNueva.getTime();
      this.nuevosDiasIncapacidad = (diff/(1000*60*60*24))+1;
      //Si el resultado de dias es negativo 0
      //this.nuevosDiasIncapacidad = this.nuevosDiasIncapacidad > 0 ? this.nuevosDiasIncapacidad : 0;
      this.acumulaDias = true;
    }
    //traslape que no requiere calculo de fechas y dias (incapacidad que no acumula dias)
    else 
    {
      this.fechaInicioNueva =  this.fechaInicioActual;  
      this.fechaFinNueva = this.fechaFinActual;
      this.nuevosDiasIncapacidad = this.dataIn.incapacidad_data.dias_incapacidad;
      this.acumulaDias = false;
    }

  }

  confirmModal(){  
    this.passEntry.emit({resultado: 'si'});
    this.activeModal.close(
      {
        resultado: 'si', 
        nueva_fecha_inicio_string: this.getFormattedDate(this.fechaInicioNueva),
        nuevos_dias_incapacidad: this.nuevosDiasIncapacidad,
        nueva_fecha_fin_string: this.getFormattedDate(this.fechaFinNueva),
      }
    );
  }  

  closeModal(){  
    this.passEntry.emit({resultado: 'no'});
    this.activeModal.close({resultado: 'no'});
  }  

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
}


