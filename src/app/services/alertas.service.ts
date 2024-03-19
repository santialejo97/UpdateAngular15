import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlertaComponent } from '../component/utilidades/modal-alerta/modal-alerta.component';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  optionsModal: NgbModalOptions = {
    size: 'lg',
    backdrop:'static',
    backdropClass: "light-blue-backdrop",
    windowClass: 'dark-modal',
    centered: true
  };
  constructor(private modalService: NgbModal) { }

  async alertaInformativa(tituloParametro: string, mensajeParametro: string, textoBotonParametro: string) {
    const modalRef = this.modalService.open(ModalAlertaComponent,this.optionsModal);
    modalRef.componentInstance.dataIn = {titulo: tituloParametro, mensaje: mensajeParametro, textoBoton: textoBotonParametro};
    await modalRef.result.then(async (result) => {
      console.log('message alert')
    });

  }
}