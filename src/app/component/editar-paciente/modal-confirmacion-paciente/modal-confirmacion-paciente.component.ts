import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-modal-confirmacion-paciente',
  templateUrl: './modal-confirmacion-paciente.component.html',
  styleUrls: ['./modal-confirmacion-paciente.component.scss']
})
export class ModalConfirmacionPacienteComponent implements OnInit {

  @Input() public dataIn;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //incapacidad_modelo:IIncapacidad;

  constructor(
    public activeModal: NgbActiveModal,
    //private fakeService: FakeModelsService,
    //private parametrosIncapacidadesService: ParametrosIncapacidadesService
  ) { 
  }

  async ngOnInit() {

    // console.log('this.dataIn')
    // console.log(this.dataIn)
    //this.incapacidad_modelo = this.dataIn.incapacidad_data;
  }


  confirmModal(){  
    this.passEntry.emit({resultado: 'si'});
    this.activeModal.close({resultado: 'si'});
  
    
  }  

  closeModal(){  
    this.passEntry.emit({resultado: 'no'});
    this.activeModal.close({resultado: 'no'});
  }  

}
