import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { LoggingService } from 'src/app/services/logging.service';
import { NotificationesService } from 'src/app/services/notificaciones.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { LoggingService } from './services/logging.service';
// import { ErrorService } from './services/error.service';
// import { NotificationService } from './services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  baseUrlSIIN = environment.baseSiteSIIN;
  
  constructor(private injector: Injector, private router: Router) { }
  
  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationesService);

    

    let message;
    let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      //stackTrace = errorService.getServerErrorStackTrace(error);
      notifier.showError('','Error en el servidor');

    } else {
      // Client Error

      //if(error.message.includes('401 Unauthorized')){ 
      if(error.message.includes('"code_error_1":"481"')){ 
        
          message = errorService.getClientErrorMessage(error);
          notifier.showErrorAuthorization('No Autorizado','El tiempo de la sesión ha terminado, Debe ingresar nuevamente <a href="/'+ this.baseUrlSIIN + '/account/login" class="breadcrumb-text">Login</a>');
          
          localStorage.removeItem('usuario');
          localStorage.removeItem('perfil');
          localStorage.removeItem('complementario');
          localStorage.removeItem('complementario2');
          localStorage.removeItem('rutas');
          //this.router.navigate(['/account/login']);
          
      }else{

      //  error.
      //   if (error1.status === 405) {
      //     alert('e 405')
      //   }
        console.log('error');
        console.log(error);
        message = errorService.getClientErrorMessage(error);
        console.log(message)
        if(!error.message.includes('Unauthorized'))
        notifier.showError('','Error en la aplicación');
      }
    }
    // Always log errors
    logger.logError(message, stackTrace);
    console.error(error);
  }
}