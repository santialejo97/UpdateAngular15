import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { IPacienteModel } from 'src/app/models/paciente.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-informacion-incapacidadCR',
  templateUrl: './modal-detalle-incapacidad.component.html',
  styleUrls: ['./modal-detalle-incapacidad.component.scss'],
})
export class ModalDetalleIncapacidadCRComponent implements OnInit {
  incapacidad: any;
  incapacidadDetalle: any;

  @Input() public incapacidadIn!: IIncapacidad;
  /*  @Input() public incapacidadIn;*/
  /*  @Input() public pacienteIn: IPacienteModel;*/

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    console.log(this.incapacidadIn);
    this.incapacidad = this.incapacidadIn;
    this.incapacidadDetalle = this.incapacidad.incapacidad_data;
    console.log(this.incapacidadDetalle);
    //  console.log('info IncapacidadIn')
    //  console.log(this.incapacidadIn)
    //  console.log(this.incapacidadIn.dias_incapacidad)
    // console.log('info pacienteIn')
    // console.log(this.pacienteIn)
  }

  closeModal() {
    /*    this.passEntry.emit({ resultado: 'no' });*/
    this.activeModal.close({ resultado: 'no' });
  }
}
