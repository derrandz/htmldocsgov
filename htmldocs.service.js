'use strict';

const q = require('q');
const async = require('async');
const mammoth = require('mammoth');
const filesystem = require('fs');
const utils = require('./htmldocs.utils.js');

/**
 * Utility features object
 */
let myUtils = {
    /**
     * @param  {} filename
     */
    parseFilename: function (filename) {
        return (function (arr) {
            return arr[arr.length - 1];
        }(filename.split('/')));
    },

    serial: utils.serial
};

/**
 * Reads a directory's files
 * @param  {String|Buffer} dirPath
 * @return {Promise}
 */
let readDir = function (dirPath) {
    let deferred = q.defer();
    filesystem.readdir(dirPath, function (err, files) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve( files.map(f => `${dirPath}/${f}`));
        }
    });
    return deferred.promise;
};

/**
 * @param  {} docFilePath
 * @return {Promise}
 */
let convertFile = function (docFilePath) {
    return mammoth.convertToHtml({path: docFilePath}).then(function (result) {
        return {
            html: result.value,
            logs: result.message,
            filename: myUtils.parseFilename(docFilePath)
        }
    });
};

/**
 * @param  {} dirPath
 */
let convertDir = (dirPath) => readDir(dirPath).then(function(files) {
    let makeSerial = (f) => function(cb) {
        convertFile(f).then(function(result) {
            cb(null, result);
        });
    };
    
    let promises = files.map(makeSerial);
    return myUtils.serial(promises);
});

/**
 * Exporting a utility object.
 */
module.exports = {
    __utils: myUtils,
    writeFile: utils.writeFile,
    convert: {
        dir: convertDir,
        file: convertFile
    }
};