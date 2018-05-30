const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, nativeImage } = require('electron');
const path = require('path');
const url = require('url');

const fs = require('fs');


const { getFiles } = require("./lib/directoryAccess");

const colors = require("colors");


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let contextMenu;




const createWindow = () => {
  // set timeout to render the window not until the Angular
  // compiler is ready to show the project
  setTimeout(() => {
    // Create the browser window.
    win = new BrowserWindow({
      title: "Michale's Electron App",
      width: 800,
      height: 600,
      icon: './src/favicon.ico',
      //icon: './src/assets/icons/documentIcon.png',
      webPreferences: {
        nodeIntegration: true // turn it on to use node features
      }
    });

    // and load the app.
    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });
  }, 10000);


  //add context menu
  initContextMenu();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on("before-quit", () => {
  console.log('Quit called on app!');
  ipcMain.removeAllListeners("message");

});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("message", (event, message) => {

  console.log("Received a message from client ", message);
  event.sender.send("message", "Message from main process!");
});

ipcMain.on("openFileDialog", (event) => {

  let fileFilters = [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] },
    { name: 'All Files', extensions: ['*'] }
  ];



  console.log("Open file dialog");
  let myDefaultPath = path.join("/", "home", "ganesanm", "Downloads");
  console.log(`Test:Your current path is : ${myDefaultPath}`);

  //get the current window
  let myWindow = BrowserWindow.fromWebContents(event.sender);

  dialog.showOpenDialog(myWindow, {
    filters: fileFilters,
    title: "Open a file dialog",
    buttonLabel: "Select a file...",
    properties: ['openFile'],
    defaultPath: myDefaultPath,
  }, (files) => {
    console.log(`Your files: ${files}`);
    event.sender.send("openFileDialog", files);
  });

});


ipcMain.on("openDirectoryDialog", (event) => {

  console.log("Open directory dialog");
  let myDefaultPath = path.join("/", "home", "ganesanm", "Downloads");
  console.log(`Test:Your current path is : ${myDefaultPath}`);

  //get the window
  let myWindow = BrowserWindow.fromWebContents(event.sender);

  dialog.showOpenDialog(myWindow, {
    title: "Open a workspace",
    buttonLabel: "Select ..",
    properties: ['openDirectory'],
    defaultPath: myDefaultPath,
  }, (files) => {
    console.log(`Your files: ${files}`);
    event.sender.send("openDirectoryDialog", files);
  });

});

const initContextMenu = () => {

  contextMenu = new Menu();
  contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
  contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
  contextMenu.append(new MenuItem({ label: 'Paste', role: 'Paste' }));
  contextMenu.append(new MenuItem({ label: 'Select All', role: 'selectall' }));
  contextMenu.append(new MenuItem({ type: 'separator' }));
  contextMenu.append(new MenuItem({
    label: 'Custom', click: () => {
      console.log('You just clicked a custom menu item from main');
    }
  }));

};


ipcMain.on('show-context-menu', (event) => {

  let currentWindow = BrowserWindow.fromWebContents(event.sender);

  contextMenu.popup(currentWindow);

});

ipcMain.on("readFiles", (event, dirPath) => {
  
   console.log(typeof(dirPath));
   console.log(`Your current path to read files is: ${dirPath.toString()}`);

   getFiles.readDirectory(dirPath.toString()).then((files)=>{
       files.forEach(file=>{
         console.log(file);
       });
   
      event.sender.send("selectedFiles",files);


   }).catch((error)=>{
        console.log(`Error from Promise Code: ${error}`);
   });

})

//Open Message Box
ipcMain.on("OpenMessageDialog",(event,data)=>{


   let myWindow = BrowserWindow.fromWebContents(event.sender);

   let iconPath = path.join(__dirname,"assets","icons","documentIcon.png");

   if(fs.existsSync(iconPath)){
     console.log(`Icons Path: ${iconPath} does exists!`);
   }
   else{
      console.log(`Sorry the icon path: ${iconPath} does not exist!`);
   }

   //let documentIcon= nativeImage.createFromPath(iconPath);
   let nativeimage = require('electron').nativeImage;
   let documentIcon = nativeimage.createFromPath(iconPath);
   console.log(documentIcon.toPNG());



   dialog.showMessageBox(myWindow,{
         type:"info",
         icon: documentIcon,
         title: "Sample Message Box",
         defaultId: 0,
         cancelId: 3,
         checkboxLabel: "Michael Rocks",
         message: "Welcome to my World of Data",
         buttons:['Save','Cancel','Don\'t Save','Mexican']
   },(response,checkboxChecked)=>{
      
     //find out what is the platform
     console.log(`Your platform is: ${process.platform}`);

   

     if(checkboxChecked){
         console.log(colors.magenta('You checked the checkbox for the dialog'));

     }


     if(response){
      console.log(colors.magenta(`Your clicked: ${response}`));
     }
     else{
        console.log(colors.yellow('You clicked the save box!'))
     }

   })

});








