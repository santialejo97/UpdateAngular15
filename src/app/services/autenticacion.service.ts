import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { send } from 'process';
import { IRecaptchaRequest } from 'src/app/interfaces/IRecaptchaRequest';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  isBrowser = false;
  url: string = environment.servicioBackend + "/Autenticacion/";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)){ this.isBrowser = true; }
  }

  ValidarRecaptcha(datosRecaptcha: IRecaptchaRequest): Observable < any > {

  let direccionAutenticar = this.url + 'ValidarRecaptcha'

    return this.http.post<any>(direccionAutenticar, datosRecaptcha);
  }


}

class RecaptchaResponse {
  Success: boolean;
  ErrorCodes: string[];
    }
