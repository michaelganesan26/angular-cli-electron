//Access files from a directory 

import * as fs from 'fs';
import { dirname } from 'path';


export class getFiles{
 


  constructor(){}


  public static readDirectory(dirName:string){

    return new Promise((resolve,reject)=>{

        fs.exists(dirName,(exists: boolean)=>{
             if(!exists){
              reject(`Sorry dirname does not exist! ${dirName}`);
             }
             else{
                //Return the files 
               fs.readdir(dirName,(err:NodeJS.ErrnoException,files:string[])=>{

                 if(err)
                   reject(err.message);
                 else{
                    resolve(files);
                 }
               })
             }
        });

    })
 

  }













}


