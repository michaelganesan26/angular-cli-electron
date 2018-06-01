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
  data: string = "Simple Message";

  //files
  files: string[] = [];




  constructor(private render: Renderer2,
    private _electronService: ElectronService, private ref: ChangeDetectorRef) {
    //this.ref.detectChanges();
    this._electronService.ipcRenderer.on("message", (event: any, message: any) => {
      console.log(`Here is your message: ${message}`);
    });

    this._electronService.ipcRenderer.on("openDirectoryDialog", (event: any, filePath: any) => {
      console.log("Message received from the main process!");
      console.log(`Selected directory: ${filePath}`);
      this.data = filePath;
      console.log(`Your current directory is: ${this.data}`);
      this.ref.detectChanges();

      //Send and open the files for the directory
      this._electronService.ipcRenderer.send("readFiles", this.data);


    });

    this._electronService.ipcRenderer.on("openFileDialog", (event: any, filePath: any) => {
      console.log("Message received from the main process!");
      console.log(`Selected file: ${filePath}`);
      this.data = "selected file: " + filePath;
      console.log(`Your current directory is: ${this.data}`);
      this.ref.detectChanges();
    });

    this._electronService.ipcRenderer.on("selectedFiles", (event: any, files: string[]) => {

      console.log(files);
      this.files = files;
      this.ref.detectChanges();


    });


    //this.addContextMenuFromRenderer();

    window.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this._electronService.ipcRenderer.send("show-context-menu");

    })

  }

  //Call the context menu from the main process
  private callContextMenuFromMain() {

    window.addEventListener('contextmenu', (event) => {

      event.preventDefault();
      this._electronService.ipcRenderer.send("show-context-menu");
    });
  }


  //add the context menu
  private addContextMenuFromRenderer() {

    let template: any = [
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Cut', role: 'cut' },
      { label: 'Select All', role: 'selectall' },
      { type: 'separator' },
      {
        label: 'Custom', click: () => {
          console.log(`You just clicked me from the context menu`);
        }
      }
    ];

    let contextMenu = this._electronService.remote.Menu.buildFromTemplate(template);

    window.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      console.log('Called context menu');
      contextMenu.popup({
        callback: () => {
          console.log('window is closed(contextMenu)');
        }
      });
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

  openDirectoryDialog(event: MouseEvent) {
    this.data = "open Directory Dialog";
    //open the file dialog send request to main  process
    this._electronService.ipcRenderer.send("openDirectoryDialog");

  }

  openFileDialog(event: MouseEvent) {
    this.data = "open File Dialog";
    //open the file dialog send request to main  process
    this._electronService.ipcRenderer.send("openFileDialog");

  }

  //Open Message Dialog
  openMessageDialog(event:MouseEvent){
       this._electronService.ipcRenderer.send("OpenMessageDialog",{icon:"info"});

      }


<<<<<<< HEAD
  //button start a remote process
  startRemoteProcess(event:MouseEvent){

     this._electronService.ipcRenderer.send("startRemoteProcess",{id:"work"});

  }
=======
      openErrorDialog(event:MouseEvent){
         this._electronService.ipcRenderer.send("OpenErrorDialog",{error:"Simple Error"});   





      }
>>>>>>> 8af691d06b71a4387d1c75c3fd19280039d0c7fa





}
