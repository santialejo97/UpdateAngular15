import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FakeModelsService {

  constructor() { }
 
  getUsers() {
     
    let list = [];
 
    for (let index = 0; index < 100; index++) {
      list.push({codigo : "AA", descripcion :"GG", id: Math.random()});
    }
    return list;
  }
}
