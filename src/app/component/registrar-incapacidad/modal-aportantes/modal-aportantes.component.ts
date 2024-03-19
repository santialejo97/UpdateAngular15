import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from 'src/app/services/logging.service';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';

@Component({
  selector: 'app-modal-aportantes',
  templateUrl: './modal-aportantes.component.html',
  styleUrls: ['./modal-aportantes.component.scss']
})
export class ModalAportantesComponent implements OnInit {

  @Input() public dataIn: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  listaAportantes: Array<any> = [];
  listaRelacionesPacienteAportante: Array<any> = [];
  listaAdministradorasByCodRegimenARL: Array<any> = [];
  listaAdministradorasByCodRegimenEPS: Array<any> = [];
  page=1; 
  pageSize=7;

  constructor(
    public activeModal: NgbActiveModal,
    private parametrosIncapacidadesService: ParametrosIncapacidadesService,
    private loggingService: LoggingService    
  ) { 
  }

  async ngOnInit() {

    this.loggingService.registroLog('this.dataIn.aportantes')
    this.loggingService.registroLog(this.dataIn)
    this.listaAportantes = this.dataIn.aportantes;
    this.listaRelacionesPacienteAportante = this.dataIn.relacionesPacienteAportante;
    
    this.listaAdministradorasByCodRegimenARL = await this.parametrosIncapacidadesService.get('/Administradoras?codRegimen=&tipoAdministradora=' + '3');
    this.listaAdministradorasByCodRegimenEPS = await this.parametrosIncapacidadesService.get('/Administradoras?codRegimen=&tipoAdministradora=' + '1');

    if(this.listaAportantes){

      this.listaAportantes.forEach(aportante => {
        aportante.relacionPacienteAportante = null;

        if(this.listaRelacionesPacienteAportante){

          this.listaRelacionesPacienteAportante.forEach(async relPacienteAportante => {
            if(relPacienteAportante.tipo_documento_ap ==  aportante.tipo_documento && relPacienteAportante.numero_documento_ap == aportante.numero_documento){

              const administradoraEncontradaARL = await this.listaAdministradorasByCodRegimenARL.find(function(element) {
                return element.cod_administradora == relPacienteAportante.cod_administradora_arl;
              })

              const administradoraEncontradaEPS = await this.listaAdministradorasByCodRegimenEPS.find(function(element) {
                return element.cod_administradora == relPacienteAportante.cod_administradora_eps;
              })
          

              relPacienteAportante.desc_administradora_arl = administradoraEncontradaARL?.razon_social;
              relPacienteAportante.desc_administradora_eps = administradoraEncontradaEPS?.razon_social;
              aportante.relacionPacienteAportante = relPacienteAportante;
            }
          });
        }

      });
    }

    //this.listaRelacionesPacienteAportante = this.dataIn.relacionesPacienteAportante;  
  }

  clickedRow(index: number){  
    this.passEntry.emit(this.listaAportantes[(this.pageSize*(this.page-1)) + index]);
    this.activeModal.close(this.listaAportantes[(this.pageSize*(this.page-1)) + index]);
  }

  closeModal(){  
    this.activeModal.close(
      {
        tipo_documento: '',
        numero_documento: '',
        razon_social: ''
      }
      );
  }
  
}