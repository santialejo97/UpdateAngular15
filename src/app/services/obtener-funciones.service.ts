import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { IFuncionalidad } from 'src/app/interfaces/IFuncionalidad';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';

@Injectable({
  providedIn: 'root',
})
export class ObtenerFuncionesService {
  url: string = environment.servicioBackend + '/Menu/';

  constructor(private http: HttpClient) {}

  TraerFunciones(idRol: IPerfil): Observable<IFuncionalidad> {
    let direccionFuncionalidades = this.url + 'CargarMenu';

    return this.http
      .post<IFuncionalidad>(direccionFuncionalidades, idRol)
      .pipe(catchError((error) => of(error)));
  }

  //TraerIDUsuarioEntidad(perfil: IPerfil): Observable<number>
  TraerIDUsuarioEntidad(perfil: IPerfil): Observable<IPerfilComple> {
    let direccionIDUsuario = this.url + 'BuscarUsuario';

    //return this.http.post<number>(direccionIDUsuario, perfil);
    return this.http
      .post<IPerfilComple>(direccionIDUsuario, perfil)
      .pipe(catchError((error) => of(error)));
  }
}
