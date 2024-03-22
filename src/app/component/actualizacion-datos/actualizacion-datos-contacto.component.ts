import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //listaDocumento
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from, of } from 'rxjs';
import { IPerfilComple } from 'src/app/interfaces/IPerfilComple';
import { AdministradoraService } from 'src/app/services/administradoraservice';
import { AlertasService } from 'src/app/services/alertas.service';
import { NotificationesService } from 'src/app/services/notificaciones.service';
import { ConfirmDialogComponent } from './confirmdialog/ConfirmDialogComponent';
import { catchError } from 'rxjs/operators';
import { IPerfil } from 'src/app/interfaces/IPerfil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizacion-datos-contacto',
  templateUrl: './actualizacion-datos-contacto.component.html',
  styleUrls: ['./actualizacion-datos-contacto.component.scss'],
})
export class ActualizacionDatosComponent implements OnInit {
  actualizacionForm!: FormGroup;
  perfil2: IPerfilComple =
    JSON.parse(localStorage.getItem('complementario2')!) || '';
  edit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private administradoraservice: AdministradoraService,
    private notificacionService: NotificationesService,
    private ngbModal: NgbModal,
    private router: Router,
    private Alertas: AlertasService
  ) {
    this.actualizacionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      tipodoc: [''],
      razon: [''],
    });
  }

  ngOnInit() {
    let datos: IPerfil[] =
      JSON.parse(localStorage.getItem('complementario') || '') || [];
    this.actualizacionForm.controls['tipodoc'].setValue(datos[0].nit);
    this.actualizacionForm.controls['razon'].setValue(datos[0].nombreEntidad);
    this.confirm(
      '“¿Desea cambiar los datos de contacto?”',
      'Actualizar'
    ).subscribe((valid) => {
      this.edit = valid;
      if (!this.edit) this.actualizacionForm.disable();
      else this.actualizacionForm.enable();

      this.actualizacionForm.controls['tipodoc'].disable();
      this.actualizacionForm.controls['razon'].disable();
    });
  }

  async onSubmit() {
    if (this.checkEmailsMatch(this.actualizacionForm) != undefined) {
      await this.Alertas.alertaInformativa(
        'Advertencia',
        'Corrige el correo electrónico.',
        'Cerrar'
      );
      return;
    }

    if (
      this.actualizacionForm.valid &&
      this.checkEmailsMatch(this.actualizacionForm) == undefined
    ) {
      let administradora = {
        cod_administradora: this.perfil2.idEntidad?.toString(),
        correo_electronico: this.actualizacionForm.controls['email'].value,
      };

      const respuesta = await this.administradoraservice.put(administradora);
      if (respuesta!.resultado == '0') {
        await this.Alertas.alertaInformativa(
          'Advertencia',
          'No se pudo actualizar la información',
          'Cerrar'
        );
      } else {
        await this.Alertas.alertaInformativa(
          'Advertencia',
          'Datos de contacto actualizados exitosamente',
          'Cerrar'
        );
        this.back();
      }
    }
  }

  checkEmailsMatch(group: FormGroup) {
    const email = group.get('email')!.value;
    const confirmEmail = group.get('confirmEmail')!.value;

    return email === confirmEmail ? undefined : { emailMismatch: true };
  }

  confirm(prompt = 'Really?', title = 'Confirm'): Observable<boolean> {
    const modal = this.ngbModal.open(ConfirmDialogComponent, {
      backdrop: 'static',
    });

    modal.componentInstance.prompt = prompt;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError((error) => {
        console.warn(error);
        return of(false);
      })
    );
  }

  back() {
    this.router.navigate(['/menu-principal']);
  }
}
