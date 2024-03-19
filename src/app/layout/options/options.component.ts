import { Component, OnInit } from '@angular/core';
import { NotificationesService } from 'src/app/services/notificaciones.service';
import { ObtenerFuncionesService } from 'src/app/services/obtener-funciones.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})

export class OptionsComponent implements OnInit {

  perfilSeleccionado: any[];
  submitted = false;
  rutas: any;


  constructor( private obtenerFuncionesService: ObtenerFuncionesService,
    private alertService: NotificationesService
      ) { }

  ngOnInit(): void {

    this.obtenerFunciones();
    this.submitted = true;

  }

  obtenerFunciones() {
        
    this.rutas = JSON.parse(localStorage.getItem('rutas')) || [];
    if(this.rutas != null && this.rutas.length == 0 ){

      this.perfilSeleccionado = JSON.parse(localStorage.getItem('complementario')) || [];

      if(this.perfilSeleccionado[0]){
        this.obtenerFuncionesService.TraerFunciones(this.perfilSeleccionado[0])
          .subscribe(data => {
            var arreglo = JSON.parse(JSON.stringify(data));

            this.rutas = arreglo.map(function (arreglo) {
              return arreglo.ruta;
            });

            localStorage.setItem('rutas', JSON.stringify(this.rutas));

          },
            error => {
              this.alertService.showError(error, "");
            }
        );
      }
    }

  }

  mostrarFuncion(e): boolean {

    const encontrado = (this.rutas || '').includes(e);

    if (encontrado) {
      return true;
    }
    else {
      return false;
    }
      
  }

}
