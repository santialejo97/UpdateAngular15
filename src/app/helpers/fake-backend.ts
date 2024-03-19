import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError } from 'rxjs/operators';
import { LoginModel } from '../models/Login.model';
import { IUsuario } from '../interfaces/IUsuario';
import { isUndefined } from 'util';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                default:
                    return next.handle(request);
            }    
        }

      function authenticate() {
          //const { username, password, datosUsuario } = body;
          const {datosUsuario } = body;
          //const user: LoginModel = new LoginModel();
        const user: IUsuario = JSON.parse(localStorage.getItem('usuario')) || [];

          //user.username = username;
          //user.password = password;
                                
          //const user = users.find(x => x.username === username && x.password === password);

         if (!datosUsuario) return error('Usuario o contraseña invalidos'); 

        return ok({
          id: user.registroProfesional,
          username: user.nombreUsuario,
          firstName: user.primerNombre,
          lastName: user.primerApellido,
          token: 'fake-jwt-token'
         })
       }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
         // return throwError({ error: { message } });
          return throwError( message);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
