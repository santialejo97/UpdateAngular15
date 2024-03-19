import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { IUsuario } from 'src/app/interfaces/IUsuario';
import { IAportanteModel } from 'src/app/models/Aportante.model';
import { IPacienteModel } from 'src/app/models/paciente.model';
//import { IIncapacidad } from 'src/app/models/incapacidad.model';


@Component({
  selector: 'app-informacion-pago',
  templateUrl: './informacion-pago.component.html',
  styleUrls: ['./informacion-pago.component.scss']
})
export class InformacionPagoComponent implements OnInit {

  @Input() public pagoIn: any;
  //@Input() public aportante: IAportanteModel;
   
  fechaRegistro: Date = new Date(); 
  //  aportante: IAportanteModel;

  usuario: string;
  numUsuario: string;
  entidad: any;
  numEntidad: string;

  constructor() { 
    
  }

  ngOnInit() {
      console.log('info PagoIn')
      console.log(this.pagoIn)
      //console.log(this.aportante)
    //  console.log(this.incapacidadIn.dias_incapacidad)
    // console.log('info pacienteIn')
    // console.log(this.pacienteIn)

      const user: IUsuario = JSON.parse(localStorage.getItem('usuario')) || [];
      const perfil: IPerfil = JSON.parse(localStorage.getItem('complementario')) || [];

      this.usuario = user.primerNombre + ' ' + user.segundoNombre + ' ' + user.primerApellido + ' ' + user.segundoApellido;
      this.numUsuario = user.tipoDocumento + ' ' + user.numeroDocumento;

      this.numEntidad = perfil[0].nit;
      this.entidad = perfil[0].nombreEntidad;
  }

  

}


