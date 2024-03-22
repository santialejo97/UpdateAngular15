import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { IRecaptchaRequest } from 'src/app/interfaces/IRecaptchaRequest';
import { IRetornoRecaptcha } from 'src/app/interfaces/IRetornoRecaptcha';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit {
  aFormGroup!: FormGroup;
  siteKey: string;
  secretKey: string;
  validacionRecaptcha: any[] = [];
  retornoLogin: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacionService: AutenticacionService
  ) {
    this.siteKey = environment.siteKey;
    this.secretKey = environment.secretKey;
    this.retornoLogin = false;
  }

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
    });
  }

  resolved(captchaResponse: string) {
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.validarToken(captchaResponse);
  }

  onError(errorDetails: RecaptchaErrorParameters) {
    console.log(`Se encontro un error: ${errorDetails}`);
  }

  validarToken(token_: string) {
    const datos: IRecaptchaRequest = {
      token: token_,
      llaveSegura: this.secretKey,
    };

    this.autenticacionService.ValidarRecaptcha(datos).subscribe(
      (data) => {
        const cs: IRetornoRecaptcha = (this.validacionRecaptcha = JSON.parse(
          JSON.stringify(data)
        ));
        this.retornoLogin = cs.success;
        //console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }
}
