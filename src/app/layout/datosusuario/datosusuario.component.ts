import { Component, OnInit } from '@angular/core';
import { IUsuario } from 'src/app/interfaces/IUsuario';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { Router } from '@angular/router';


@Component({
  selector: 'app-datosusuario',
  templateUrl: './datosusuario.component.html',
  styleUrls: ['./datosusuario.component.scss']
})

export class DatosusuarioComponent implements OnInit {

  login: string;
  usuario: string;
  rol: string;
  numEntidad: string;
  entidad: string;
  codigoEntidad: string;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    const user: IUsuario = JSON.parse(localStorage.getItem('usuario')) || [];
    const perfil: IPerfil = JSON.parse(localStorage.getItem('complementario')) || [];

    this.login = user.nombreUsuario;
    this.usuario = user.primerNombre + ' ' + user.segundoNombre + ' ' + user.primerApellido + ' ' + user.segundoApellido;
    if(perfil[0]){
      this.rol = perfil[0].nombreRol;
      this.numEntidad = perfil[0].nit;
      this.entidad = perfil[0].nombreEntidad;
      this.codigoEntidad = perfil[0].codigoEntidad;

      //console.log("datos usuario:" + this.codigoEntidad);
    }
    else{
      localStorage.removeItem('usuario');
      localStorage.removeItem('perfil');
      localStorage.removeItem('complementario');
      localStorage.removeItem('complementario2');
      localStorage.removeItem('rutas');
      this.router.navigate(['/account/login']);
    }
  }

  
  
}
