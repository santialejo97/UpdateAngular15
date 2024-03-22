import { Component, Input, OnInit } from '@angular/core';
import { IIncapacidad } from 'src/app/models/incapacidad.model';
import { IPacienteModel } from 'src/app/models/paciente.model';
import { ParametrosIncapacidadesService } from 'src/app/services/parametros-incapacidades.service';
import * as FileSaver from 'file-saver';
import { DownloadService } from 'src/app/services/download.service';
import { IUsuario } from 'src/app/interfaces/IUsuario';
import { IPerfil } from 'src/app/interfaces/IPerfil';

@Component({
  selector: 'app-lista-incapacidades',
  templateUrl: './lista-incapacidades.component.html',
  styleUrls: ['./lista-incapacidades.component.scss'],
})
export class ListaIncapacidadesComponent implements OnInit {
  @Input() public imprimirModelo: any;
  usuario!: string;
  entidad: any;

  constructor(
    private parametrosIncapacidadesService: ParametrosIncapacidadesService,
    private downloadService: DownloadService
  ) {}

  ngOnInit(): void {
    const user: IUsuario = JSON.parse(localStorage.getItem('usuario')!) || [];
    const perfil: IPerfil[] =
      JSON.parse(localStorage.getItem('complementario')!) || [];

    this.usuario =
      user.primerNombre +
      ' ' +
      user.segundoNombre +
      ' ' +
      user.primerApellido +
      ' ' +
      user.segundoApellido;
    this.entidad = perfil[0].nombreEntidad;

    console.log(this.imprimirModelo);
  }
}
