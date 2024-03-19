import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //listaDocumento
import { AdministradoraService } from 'src/app/services/administradoraservice';

@Component({
  selector: 'app-actualizacion-datos',
  templateUrl: './actualizacion-datos.component.html',
  styleUrls: ['./actualizacion-datos.component.scss']
})
export class ActualizacionDatosComponent implements OnInit {

  actualizacionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private administradoraservice: AdministradoraService) {
    this.actualizacionForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      secondName: [''],
      firstlastName: ['', Validators.required],
      secondlastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.actualizacionForm.valid) {
      let administradora = {
        cod_administradora: 1,
        primer_nombre: this.actualizacionForm.controls['firstName'].value,
        segundo_nombre: this.actualizacionForm.controls['secondName'].value,
        primer_apellido: this.actualizacionForm.controls['firstlastName'].value,
        segundo_apellido: this.actualizacionForm.controls['secondlastName'].value,
        correo_electronico: this.actualizacionForm.controls['email'].value
      };
      console.log(administradora);
      await this.administradoraservice.put(administradora);
    }
  }

  checkEmailsMatch(group: FormGroup) {
    const email = group.get('email')!.value;
    const confirmEmail = group.get('confirmEmail')!.value;
  
    return email === confirmEmail ? null : { emailMismatch: true };
  }
}
