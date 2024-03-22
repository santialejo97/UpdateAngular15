import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { IPacienteModel } from 'src/app/models/paciente.model';

@Component({
  selector: 'app-informacion-paciente',
  templateUrl: './informacion-paciente.component.html',
  styleUrls: ['./informacion-paciente.component.scss'],
})
export class InformacionPacienteComponent implements OnInit {
  @Input() public incapacidad!: IIncapacidad;
  @Input() public pacienteIn!: IPacienteModel;

  constructor() {}

  ngOnInit() {
    // console.log('info Incapacidad')
    // console.log(this.incapacidad)
    // console.log('info paciente')
    // console.log(this.pacienteIn)
  }
}
