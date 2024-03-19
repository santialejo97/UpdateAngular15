import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ValidarUsuarioService } from '../services/validar-usuario.service';

// import { AccountService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService, private validarUsuarioService : ValidarUsuarioService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401 || err.status === 403) {
                    // auto logout if 401 response returned from api
                   
                    if(err.error?.code_error_1 == 481){
                        return throwError(err.error);
                        //return next.handle(request);
                    }
                    //this.accountService.CerrarSesion();
                    
                    const currentUser = this.accountService.userValue;
                    //console.log('currentUser old token: ' + currentUser.access_token)

                    if(currentUser)
                        return this.refreshToken(currentUser, request, next); 
                }
            
            const error = err.error?.message || err.statusText;
            return throwError(error);
        }))
    }
    
    refreshToken(currentUser: any, request: any, next: any) {
        
        // By making use of the from operator of RxJS convert the promise to an observable
        return from(this.validarUsuarioService.RefreshTokenUsuario2({'AccessToken': currentUser.access_token, 'RefreshToken': currentUser.refresh_token})).pipe(
            switchMap(t => this.updateTokenAndRetry(request, next, currentUser, t))
        )
    }
    
    updateTokenAndRetry(request: HttpRequest<any>, next: HttpHandler, currentUser: any, t: any): Observable<HttpEvent<any>> {
        // Add the new token to the request      
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + t.accessToken,
            },
        });
    
        //console.log('currentUser new token: ' + t.accessToken)
        currentUser.access_token = t.accessToken;
        currentUser.refresh_token = t.refreshToken;
        localStorage.setItem('usuario', JSON.stringify(currentUser));
        return next.handle(request);
    }
}
