import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministradoraService {
  private headers: HttpHeaders;
  private urlAministradora: string = '/Administradoras';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', "Access-Control-Allow-Origin": "*" });
  }

  public async put(body: any): Promise<any> {
    let url = environment.servicioBackend + '/parametros' + this.urlAministradora;
    const asyncResult = await this.http.put(url, body, { headers: this.headers }).toPromise();
    return asyncResult;
  }
}
