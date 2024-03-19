import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(
        private router: Router
    ) {
      
    }

    registroLog(value: any){
        if(environment.activeLogs){
            console.log(value);
        }
    }

    logError(message: string, stack: string) {
        // Send errors to server here
        console.log('LoggingService: ' + message + ' stack ' + stack);
        //this.router.navigate(['/account/login']);
    }
}
