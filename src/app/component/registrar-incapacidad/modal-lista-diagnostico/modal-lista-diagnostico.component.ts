import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { FakeModelsService } from 'src/app/services/fake-models.service';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';

@Component({
  selector: 'app-modal-lista-diagnostico',
  templateUrl: './modal-lista-diagnostico.component.html',
  styleUrls: ['./modal-lista-diagnostico.component.scss']
})
export class ModalListaDiagnosticoComponent implements OnInit {

  @Input() public dataIn;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //public usersList: any;//Array<UserModel> = [];
  public listaCie10: Array<any> = [];
  
  page=1; 
  pageSize=7;

  constructor(
    public activeModal: NgbActiveModal,
    //private fakeService: FakeModelsService,
    private parametrosIncapacidadesService: ParametrosIncapacidadesService
  ) { 
  }

  async ngOnInit() {
    //console.log(this.dataIn);
    //this.usersList = this.fakeService.getUsers();
    let dataResult = await this.parametrosIncapacidadesService.get('/Cie10/'+'');
    this.listaCie10 = dataResult;
  }

  clickedRow(index: number){  
    //this.HighlightRow = index; 
    //console.log(this.listaCie10[(this.pageSize*(this.page-1)) + index]); 
    this.passEntry.emit(this.listaCie10[(this.pageSize*(this.page-1)) + index]);
    this.activeModal.close(this.listaCie10[(this.pageSize*(this.page-1)) + index]);
  }  

  async onKeyUp(event: any) {
    console.log('values:'+event.target.value);
      let dataResult = await this.parametrosIncapacidadesService.get('/Cie10/' + event.target.value);
      this.listaCie10 = dataResult;
  };

  closeModal(){  
    //activeModal.dismiss('Cross click')
    this.activeModal.close({id:0, codigo:'', descripcion:''});
  }
  // passBack() {
  //   this.passEntry.emit(this.dataIn);
  //   this.activeModal.close(this.dataIn);
  // }
}


// export class UserModel {
//   public firstName: string;
//   public lastName: string;
//   public email: string;
// }