import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) {   
  }

  download(valuesParam:any, file: string | undefined): Observable<Blob> {
    
    return this.http.post(environment.servicioBackend + '/Incapacidad/GenerarIncapacidadPdf', valuesParam, {
      responseType: 'blob'
    });
  }
}
