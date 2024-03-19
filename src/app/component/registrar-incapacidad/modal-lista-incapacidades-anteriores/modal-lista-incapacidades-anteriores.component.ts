import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-lista-incapacidades-anteriores',
  templateUrl: './modal-lista-incapacidades-anteriores.component.html',
  styleUrls: ['./modal-lista-incapacidades-anteriores.component.scss']
})
export class ModalListaIncapacidadesAnterioresComponent implements OnInit {

  @Input() public dataIn;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  listaIncapacidadesAnteriores: Array<any> = [];
  page=1; 
  pageSize=7;

  constructor(
    public activeModal: NgbActiveModal    
  ) { 
  }

  async ngOnInit() {
    console.log(this.dataIn.listaIncapacidadesAnteriores)
    this.listaIncapacidadesAnteriores = this.dataIn.listaIncapacidadesAnteriores;
  }

  clickedRow(index: number){  
    this.passEntry.emit(this.listaIncapacidadesAnteriores[(this.pageSize*(this.page-1)) + index]);
    this.activeModal.close(this.listaIncapacidadesAnteriores[(this.pageSize*(this.page-1)) + index]);
  }  

  closeModal(){  
    this.activeModal.close({id:0, codigo:'', descripcion:''});
  }
  
}