import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiciosIntegracionService {

  private headers: HttpHeaders;
  //private accessPointUrl: string = 'https://localhost:5001/api';
  private accessPointUrl: string = environment.servicioBackend;
  private urlIntegration: string = '/integracion/api';

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', "Access-Control-Allow-Origin": "*"});
  }

  private async get(urlService:string) : Promise<any>{
    
    const asyncResult = await this.http.get(this.accessPointUrl + this.urlIntegration + urlService, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  private async post(url:string, body:any) : Promise<any>{    
    const asyncResult = await this.http.post(url, body, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  public async consultarPersonaEnServiciosExternos(body:any) {    
    const asyncResult = await this.post(this.accessPointUrl + this.urlIntegration + '/ConsultaPersona', body);
    return asyncResult;
  }


}
