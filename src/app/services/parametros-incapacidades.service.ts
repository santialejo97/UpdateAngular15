import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosIncapacidadesService {

  private headers: HttpHeaders;
  //private accessPointUrl: string = 'https://localhost:5001/api';
  private accessPointUrl: string = environment.servicioBackend;
  private urlParameters: string = '/parametros';
  private urlAnulacion: string = '/Anulacion';
  private urlIncapacidad: string = '/Incapacidad';
  
  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', "Access-Control-Allow-Origin": "*"});
  }


  public async get(urlService:string) : Promise<any>{
    
    const asyncResult = await this.http.get(this.accessPointUrl + this.urlParameters + urlService, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  public async post(urlService:string, body:any) : Promise<any>{
    
    const asyncResult = await this.http.post(this.accessPointUrl + this.urlParameters + urlService, body, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  public async postIncapacidad(urlService:string, body:any) : Promise<any>{
    
    const asyncResult = await this.http.post(this.accessPointUrl + urlService, body, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  public async postDataIncapacidad(urlService:string, body:any) : Promise<any>{
    
    const asyncResult = await this.http.post(this.accessPointUrl + this.urlIncapacidad + urlService, body, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  
  public async getIncapacidad(urlService:string) : Promise<any>{
    
    const asyncResult = await this.http.get(this.accessPointUrl + urlService, {headers: this.headers}).toPromise();
    return asyncResult;
  }

  public async guardarDatosIncapacidad(body:any) {    
    const asyncResult = await this.postIncapacidad(this.urlIncapacidad, body);
    return asyncResult;
  }

  
      public getIncapacidadAnular(urlService:string, numeroIncapacidad:number|string,  tipoDocumento:number|string,  numeroDocumento:number|string):Observable<any[]> {
        return this.http.get<any>(this.accessPointUrl + urlService + `/${numeroIncapacidad}`+`/${tipoDocumento}`+`/${numeroDocumento}` , {headers: this.headers});
      }
  
          // Inspection Types
      public getCausaAnulacion(urlService:string):Observable<any[]> {
        return this.http.get<any>(this.accessPointUrl + urlService, {headers: this.headers});
      }
  

      public setAnulacionIncapacidad(urlService:string,incapacidad:object): Observable<any>{
        console.log(this.accessPointUrl, urlService, incapacidad)
        return this.http.post(environment.servicioBackend + this.urlAnulacion, incapacidad, {headers: this.headers});
      }
  
      


  public async getCamposAnulacion(urlService: string, idIncapacidad: number | string): Promise<any> {
    const asyncResult = await this.http.get<any>(this.accessPointUrl + urlService + `/${idIncapacidad}`, { headers: this.headers }).toPromise();
    return asyncResult;
  }


  public async getPaciente(urlService: string, tipoDocumento: number | string, numeroDocumento: number | string, numeroIncapacidad: number | string): Promise<any> {
    const asyncResult = await this.http.get<any>(this.accessPointUrl + urlService + `/${tipoDocumento}` + `/${numeroDocumento}` + `/${numeroIncapacidad}`, { headers: this.headers }).toPromise();
    return asyncResult;
  }



  //AJUSTE SERVICIOS

  // public async consultarIncapacidadAnular(numeroIncapacidad: number | string, tipoDocumento: number | string, numeroDocumento: number | string) {
  //   console.log(numeroIncapacidad, tipoDocumento, numeroDocumento);
  //   const asyncResult = await this.http.get<any>(this.accessPointUrl + this.urlIncapacidad + `/${numeroIncapacidad}` + `/${tipoDocumento}` + `/${numeroDocumento}`, { headers: this.headers });
  //   return asyncResult;
  // }

  public async consultarPerdidaCapacidadLaboralPorIdConcepto(id_concepto_registro: number | string) {
    const urlGet =this.accessPointUrl + this.urlIncapacidad + `/PerdidaCapacidadLaboral/${id_concepto_registro}`;
    const asyncResult = await this.http.get<any>(urlGet, { headers: this.headers }).toPromise();
    return asyncResult;
  }

  public async guardarDatosPagoIncapacidad(body:any) {   
    console.log('RegistrarPago body'); 
    console.log(body);
    const asyncResult = await this.postIncapacidad('/RegistrarPago', body);
    return asyncResult;
  }
  
  public async guardarDatosPerdidaCapacidadLaboralIncapacidad(body:any) {   
    const asyncResult = await this.postDataIncapacidad('/PerdidaCapacidadLaboral', body);
    return asyncResult;
  }

  public async obtenerSiguienteValorSecuencia(codigo:string): Promise<any>{ 
    const urlGet =this.accessPointUrl + this.urlIncapacidad + `/Secuencia/${codigo}`;
    const asyncResult = await this.http.get(urlGet, {headers: this.headers}).toPromise();
    console.log(asyncResult)
    return asyncResult;  
  }

}
