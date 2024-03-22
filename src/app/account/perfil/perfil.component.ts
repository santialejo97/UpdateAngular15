import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterEvent } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ObtenerFuncionesService } from 'src/app/services/obtener-funciones.service';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  datosPerfil!: any;
  datosFalt!: any;
  listaEntidades: any[] = [];
  listaRoles: any;
  Entidad: any;
  nitEntidad!: string;
  idUsuario!: number;
  Rol: any;
  idRol!: Rol;
  listaEntidadesFil: any;
  arreglo: any[] = [];

  public baseUrlSIIN = environment.baseSiteSIIN; //'SiteSIIN'

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private obtenerFuncionesService: ObtenerFuncionesService
  ) {}

  ngOnInit() {
    this.listaEntidades = [];
    this.listaRoles = [];

    this.datosPerfil = JSON.parse(localStorage.getItem('perfil') || '') || [];
    Object.keys(this.datosPerfil).map((key) => {
      this.listaEntidades.push(this.datosPerfil[key].nombreEntidad);
    });

    this.listaEntidadesFil = new Set(this.listaEntidades);

    this.form = this.formBuilder.group({
      Entidad: ['', Validators.required],
      Rol: ['', Validators.required],
    });

    //this.returnUrl = this.baseUrlSIIN + '/menu-principal';
    this.returnUrl = '/menu-principal';
  }

  logout() {
    this.accountService.CerrarSesion();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    localStorage.setItem('complementario', JSON.stringify(this.datosFalt));
    localStorage.removeItem('perfil');

    this.router.navigate([this.returnUrl]);
  }

  seleccionarEntidad(e: any) {
    this.listaRoles = [];
    this.Entidad = e.target.value;
    const datosEntidad = this.datosPerfil.filter((s: any) =>
      s.nombreEntidad.includes(this.Entidad)
    );
    Object.keys(datosEntidad).map((key) => {
      this.listaRoles.push(datosEntidad[key].nombreRol);
    });

    //console.log(datosEntidad);
  }

  seleccionarRol(e: any) {
    this.Rol = e.target.value;

    this.datosFalt = this.datosPerfil.filter(
      (s: any) =>
        s.nombreRol?.includes(this.Rol) &&
        s.nombreEntidad.includes(this.Entidad)
    );

    this.obtenerFuncionesService
      .TraerIDUsuarioEntidad(this.datosFalt[0])
      .subscribe((data: any) => {
        let perfilComple = new IPerfilComple();
        //let perfilComple: IPerfilComple;
        perfilComple.idEntidad = data[0].idEntidad;
        perfilComple.idUsuarioEntidadRol = data[0].idUsuarioEntidadRol;
        perfilComple.codDepto = data[0].codDepto;
        perfilComple.codMunicipio = data[0].codMunicipio;
        perfilComple.idRol = data[0].idRol;

        //console.log(perfilComple);
        localStorage.setItem('complementario2', JSON.stringify(perfilComple));

        //this.datosFalt[0].idUsuario2 = this.idUsuarioIncapacidad;
      });

    Object.keys(this.datosFalt).map((key) => {
      this.nitEntidad = this.datosFalt[key].nit;
      this.idUsuario = this.datosFalt[key].idUsuario2;
      this.idRol = this.datosFalt[key].idRol;
    });
  }
}

export class Rol {
  idRol!: number;
}
