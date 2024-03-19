import { Injectable } from '@angular/core';
import { ILogin } from '../interfaces/ILogin';
import { IRetornoUsuario } from '../interfaces/IRetornoUsuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthenticatedResponse } from '../interfaces/IAuthenticatedResponse';

@Injectable({
  providedIn: 'root'
})
export class ValidarUsuarioService {

  private headers: HttpHeaders;
  //url: string = "https://localhost:5001/api/HerculesSOAP/";
  url: string = environment.servicioBackend + "/HerculesSOAP/";

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', "Access-Control-Allow-Origin": "*"});
  }

  AutenticarUsuario(datosLogin: ILogin): Observable<IRetornoUsuario>
  {
    let direccionAutenticar = this.url + 'Autenticar2'
    return this.http.post<IRetornoUsuario>(direccionAutenticar, datosLogin);
  }

  // private async post(url:string, body:any) : Promise<any>{    
  //   const asyncResult = await this.http.post(url, body, {headers: this.headers}).toPromise();
  //   return asyncResult;
  // }

  // // public async consultarPersonaEnServiciosExternos(body:any) {    
  // //   const asyncResult = await this.post(this.accessPointUrl + this.urlIntegration + '/ConsultaPersona', body);
  // //   return asyncResult;
  // // }
  
  // public async RefreshTokenUsuario(data: any) { 
  //   const direccionRefresh = this.url + 'RefreshToken'
  //   return await this.post(direccionRefresh, data);
  // }


  RefreshTokenUsuario2(datosLogin: any): Observable<IAuthenticatedResponse>
  {
    let direccionAutenticar = this.url + 'RefreshToken'

    // console.log('direccionAutenticar')
    // console.log(direccionAutenticar)
    // console.log(datosLogin)
    
    return this.http.post<IAuthenticatedResponse>(direccionAutenticar, datosLogin, {headers: this.headers});
  }
  
}
