"use strict";
//Access files from a directory 
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var getFiles = (function () {
    function getFiles() {
    }
    getFiles.readDirectory = function (dirName) {
        return new Promise(function (resolve, reject) {
            fs.exists(dirName, function (exists) {
                if (!exists) {
                    reject("Sorry dirname does not exist! " + dirName);
                }
                else {
                    //Return the files 
                    fs.readdir(dirName, function (err, files) {
                        if (err)
                            reject(err.message);
                        else {
                            resolve(files);
                        }
                    });
                }
            });
        });
    };
    return getFiles;
}());
exports.getFiles = getFiles;
