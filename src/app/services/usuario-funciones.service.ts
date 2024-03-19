import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFuncionalidad } from 'src/app/interfaces/IFuncionalidad';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';


@Injectable({
  providedIn: 'root'
})
export class UsuarioFuncionesService {

  url: string = environment.servicioBackend + "/Usuario/";
  headers: HttpHeaders;

  constructor(private http: HttpClient)
  {  
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', "Access-Control-Allow-Origin": "*"});
  }

  public async post(urlService:string, body:any) : Promise<any>{
    
    const asyncResult = await this.http.post(this.url + urlService, body, {headers: this.headers}).toPromise();
    return asyncResult;
  }

}
