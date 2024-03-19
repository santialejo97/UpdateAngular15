import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { IPacienteModel } from 'src/app/models/paciente.model';


@Component({
  selector: 'app-informacion-incapacidad',
  templateUrl: './informacion-incapacidad.component.html',
  styleUrls: ['./informacion-incapacidad.component.scss']
})
export class InformacionIncapacidadComponent implements OnInit {

  @Input() public incapacidadIn: IIncapacidad;
  @Input() public pacienteIn: IPacienteModel;

  constructor() { 
    
  }

  ngOnInit() {
    //  console.log('info IncapacidadIn')
    //  console.log(this.incapacidadIn)
    //  console.log(this.incapacidadIn.dias_incapacidad)
    // console.log('info pacienteIn')
    // console.log(this.pacienteIn)
  }

  

}


