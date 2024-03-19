import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationesService {

   options = {
        tapToDismiss: false,
        closeButton: true,
        preventDuplicates: true, 
        preventOpenDuplicates: true,
        timeOut: 10000,
        progressBar: true,
        positionClass: "toast-top-center"
    };

    optionsTwo = {
      tapToDismiss: false,
      closeButton: true,
      preventDuplicates: true, 
      preventOpenDuplicates: true,
      timeOut: 10000000000,
      progressBar: false,
      positionClass: "toast-top-center",
      enableHtml: true,
  };

  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title: string){
      this.toastr.success(title, message, this.options); 
  }

  showInfo(message: any, title: string){
    this.toastr.info(title, message, this.options); 
  }

  showError(message: any, title: string){
    if(title != ''){
      if(!this.toastr.currentlyActive)
        this.toastr.error(title, message, this.options); 
    }
  } 

  showErrorAuthorization(message: any, title: string){
    if(title != ''){
      if(!this.toastr.currentlyActive)
        this.toastr.error(title, message, this.optionsTwo); 
    }
  } 
  clear(){
    this.toastr.clear();
  }
}