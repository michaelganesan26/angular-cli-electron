import { element } from 'protractor';
import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ElectronService } from 'ngx-electron'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';


  constructor(private _electronService:ElectronService) { 
         this._electronService.ipcRenderer.on("message",(event:any,message:any)=>{
           console.log(`Here is your message: ${message}`);
         });

  }


  sendPingMessage(event: MouseEvent) {

   this._electronService.ipcRenderer.send("message","sending a message from the component");



  }





}
