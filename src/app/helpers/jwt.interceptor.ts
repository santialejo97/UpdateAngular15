import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../interfaces/IUsuario';

// import { environment } from '@environments/environment';
// import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    //const user = this.accountService.userValue;

    const user = JSON.parse(localStorage.getItem('usuario')!);

    //const isLoggedIn = user && user.password;
    const isLoggedIn = user && user.nombreUsuario;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          //Authorization: `Bearer ${user.password}`
          Authorization: `Bearer ${user.access_token}`,
        },
      });
    }

    return next.handle(request);
  }
}
