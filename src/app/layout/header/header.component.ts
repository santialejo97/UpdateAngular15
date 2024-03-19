import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public baseUrlSIIN = environment.baseSiteSIIN;//'SiteSIIN' 
  
  constructor() { }

  ngOnInit(): void {
  }

}
