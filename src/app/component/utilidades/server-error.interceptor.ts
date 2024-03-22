import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { NotificationesService } from 'src/app/services/notificaciones.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private notificacionesService: NotificationesService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      /*retry(1),*/
      catchError((error: HttpErrorResponse) => {
        if (error.status === 405) {
          alert('d 405');
          return of(
            new HttpResponse({
              status: error.status,
              statusText: error.statusText,
              body: error.error, // Puedes modificar este cuerpo según tus necesidades
            })
          );
        }
        if (error.status === 401) {
          // refresh token
          return of(
            new HttpResponse({
              status: error.status,
              statusText: error.statusText,
              body: error.error, // Puedes modificar este cuerpo según tus necesidades
            })
          );
        } else {
          //this.notificacionesService.showError('', error.message);
          console.log(error.message);
          return throwError(error);
        }
      })
    );
  }
}
