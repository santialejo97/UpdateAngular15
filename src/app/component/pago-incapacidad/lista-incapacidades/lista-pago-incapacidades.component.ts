import { Component, Input, OnInit } from '@angular/core';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import { DownloadService } from 'src/app/services/download.service';
import { IUsuario } from 'src/app/interfaces/IUsuario';
import { IPerfil } from 'src/app/interfaces/IPerfil';


@Component({
  selector: 'app-lista-pago-incapacidades',
  templateUrl: './lista-pago-incapacidades.component.html',
  styleUrls: ['./lista-pago-incapacidades.component.scss']
})
export class listaPagoIncapacidadesComponent implements OnInit { 
  

  @Input() public pagoModelo: any;
  // usuario: string;
  // numUsuario: string;
  // entidad: any;
  // numEntidad: string;

  constructor(private parametrosIncapacidadesService: ParametrosIncapacidadesService, private downloadService: DownloadService ) { }

  ngOnInit(): void {

      // const user: IUsuario = JSON.parse(localStorage.getItem('usuario')) || [];
      // const perfil: IPerfil = JSON.parse(localStorage.getItem('complementario')) || [];

      // this.usuario = user.primerNombre + ' ' + user.segundoNombre + ' ' + user.primerApellido + ' ' + user.segundoApellido;
      // this.numUsuario = user.tipoDocumento + ' ' + user.numeroDocumento;

      // this.numEntidad = perfil[0].nit;
      // this.entidad = perfil[0].nombreEntidad;
      //this.codigoEntidad = perfil[0].codigoEntidad;
      
      console.log(this.pagoModelo)
  }

 
  
 
}
