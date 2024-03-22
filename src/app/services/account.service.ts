import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUsuario } from '../interfaces/IUsuario';
// import { IPerfil } from '../interfaces/IPerfil';
// import { IPerfilComple } from '../interfaces/IPerfilComple';

@Injectable({ providedIn: 'root' })
export class AccountService {
  //private userSubject: BehaviorSubject<LoginModel>;
  private userSubject: BehaviorSubject<IUsuario | null>;
  //private perfilSubject: BehaviorSubject<IPerfilComple>;
  //public user: Observable<LoginModel>;
  public user: Observable<IUsuario | null>;

  token: any;
  constructor(private router: Router, private http: HttpClient) {
    //this.userSubject = new BehaviorSubject<LoginModel>(JSON.parse(localStorage.getItem('user')));
    this.userSubject = new BehaviorSubject<IUsuario | null>(
      JSON.parse(localStorage.getItem('usuario')!)
    );
    //this.perfilSubject = new BehaviorSubject<IPerfilComple>(JSON.parse(localStorage.getItem('complementario2')));
    this.user = this.userSubject.asObservable();
  }

  //public get userValue(): LoginModel {
  public get userValue(): IUsuario | null {
    return this.userSubject.value || null;
  }

  // public get perfilValue(): IPerfilComple {
  //   return this.perfilSubject.value;
  // }

  //IniciarSesion(username, password, datosUsuario) {
  IniciarSesion(datosUsuario: any, datosPerfil: any) {
    //return this.http.post<LoginModel>(`${environment.apiUrl}/users/authenticate`, { username, password, datosUsuario })
    return this.http
      .post<IUsuario>(`${environment.apiUrl}/users/authenticate`, {
        datosUsuario,
      })
      .pipe(
        map((user) => {
          //localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('usuario', JSON.stringify(datosUsuario));
          localStorage.setItem('perfil', JSON.stringify(datosPerfil));
          // console.log('datosUsuario');
          // console.log(datosUsuario);

          this.userSubject.next(user);
          return user;
        })
      );
  }

  liberarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('perfil');
    localStorage.removeItem('complementario');
    localStorage.removeItem('complementario2');
    localStorage.removeItem('rutas');
    this.userSubject.next(null);
  }

  CerrarSesion() {
    //localStorage.removeItem('user');
    this.liberarSesion();
    this.router.navigate(['/account/login']);
  }

  CerrarSesionSinRoute() {
    this.liberarSesion();
  }

  CerrarSesionParametro(paramUrl: any) {
    this.liberarSesion();
    //localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('perfil');
    localStorage.removeItem('complementario');
    localStorage.removeItem('complementario2');
    localStorage.removeItem('rutas');
    this.userSubject.next(null);
    this.router.navigate(['/account/login'], {
      queryParams: { returnUrl: paramUrl },
    });
  }
}
