import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-consultar-incapacidad',
  templateUrl: './consultar-incapacidad.component.html',
  styleUrls: ['./consultar-incapacidad.component.scss']
})
export class ConsultarIncapacidadComponent implements OnInit {
  private stepper: Stepper;
  constructor() { }
  
  next() {
    this.stepper.next();
  }

  goBack(){
    this.stepper.previous();
  }

  ngOnInit(): void {
    // this.stepper = new Stepper(document.querySelector('#stepper1'), {
    //   linear: false,   
    //   animation: true })
  }

}
