import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPerdidaCapacidadLaboral } from 'src/app/models/PerdidaCapacidadLaboral.model';

@Component({
  selector: 'app-informacion-incapacidad-pcl',
  templateUrl: './informacion-incapacidad-pcl.component.html',
  styleUrls: ['./informacion-incapacidad-pcl.component.scss']
})
export class InformacionIncapacidadPCLComponent implements OnInit {

  @Input() public pcl_data: IPerdidaCapacidadLaboral;

  constructor() { 
    
  }

  ngOnInit() {
     console.log('info pcl')
      console.log(this.pcl_data)
  }

  

}


