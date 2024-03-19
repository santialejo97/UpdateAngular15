import { Injectable } from '@angular/core';
import { 
  HttpEvent, HttpRequest, HttpHandler, 
  HttpInterceptor, HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { NotificationesService } from 'src/app/services/notificaciones.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(private notificacionesService: NotificationesService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      /*retry(1),*/
      catchError((error: HttpErrorResponse) => {
        if (error.status === 405) {
          alert('d 405')
        }
        if (error.status === 401) {
          // refresh token
          
        } else {
          //this.notificacionesService.showError('', error.message);
          console.log(error.message)
          return throwError(error);
        }
      })
    );    
  }
}