import { element } from 'protractor';
import { Component, ViewChild, Renderer2, ElementRef, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ElectronService } from 'ngx-electron'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnChanges {
  title = 'app';
  @ViewChild("fileTextArea") elTextArea: ElementRef;
  data: string = "Wow this si cool";
  constructor(private render: Renderer2,
    private _electronService: ElectronService, private ref:ChangeDetectorRef) {
     //this.ref.detectChanges();
    this._electronService.ipcRenderer.on("message", (event: any, message: any) => {
      console.log(`Here is your message: ${message}`);
    });

    this._electronService.ipcRenderer.on("openFileDialog", (event: any, filePath: any) => {
      console.log("Message received from the main process!");
      console.log(`Your file: ${filePath}`);
      this.data = filePath;
      console.log(`Your data: ${this.data}`);
      this.ref.detectChanges();
    });





  }

  ngAfterViewInit() {




  }

  ngOnChanges() {
    console.log(`Your data: ${this.data}`);


  }

  sendPingMessage(event: MouseEvent) {

    this._electronService.ipcRenderer.send("message", "sending a message from the component");
  }

  openFileDialog(event: MouseEvent) {
    this.data = "Michael";
    //open the file dialog send request to main  process
    this._electronService.ipcRenderer.send("openFileDialog");

  }




}
