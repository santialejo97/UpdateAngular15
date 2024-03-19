import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

// import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.accountService.userValue;
        //const perfil = this.accountService.perfilValue;
        if (user) {
            // authorised so return true
            //alert('verificar permiso')
            //if(perfil.)
            const rutas: String[] = JSON.parse(localStorage.getItem('rutas')) || [];
            const rutaValida = rutas.find(x => state.url.includes('/'+x) );
            if(state.url == '/menu-principal' || rutaValida)
                return true;
        }

        // not logged in so redirect to login page with the return url
        //this.accountService.CerrarSesionSinRoute();
        this.accountService.CerrarSesionParametro(state.url);
        // this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
