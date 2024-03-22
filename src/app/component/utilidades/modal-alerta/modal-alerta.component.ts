import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { FakeModelsService } from 'src/app/services/fake-models.service';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';

@Component({
  selector: 'app-modal-alerta',
  templateUrl: './modal-alerta.component.html',
  styleUrls: ['./modal-alerta.component.scss'],
})
export class ModalAlertaComponent implements OnInit {
  @Input() public dataIn: any;

  constructor(public activeModal: NgbActiveModal) {
    //console.log(this.dataIn)
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close({ resultado: 'data' });
  }
}
