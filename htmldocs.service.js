'use strict';

const q = require('q');
const async = require('async');
const mammoth = require('mammoth');
const filesystem = require('fs');

/**
 * Utility features object
 */
let utils = {
    /**
     * @param  {} filename
     */
    parseFilename: function (filename) {
        return (function (arr) {
            return arr[arr.length - 1];
        }(filename.split('/')));
    },

    serial: function (promises, seriesCallback) {
        let deferred = q.defer();

        let resolution = typeof seriesCallback === "function" ? seriesCallback.bind(deferred) : function (err, results) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        };

        async.series(promises, resolution);

        return deferred.promise;
    }
};

/**
 * Writes a file to the path that is the supplied path with the supplied value.
 * @param  {String} filepath
 * @param  {String} html
 * @return {Promise}
 */
let writeFile = function (filepathf, html) {
    let deferred = q.defer();
    
    filesystem.writeFile(filepathf, html, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(filepathf);
        }
    });

    return deferred.promise;
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
            filename: utils.parseFilename(docFilePath)
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
    return utils.serial(promises);
});

/**
 * Exporting a utility object.
 */
module.exports = {
    writeFile: writeFile,
    convert: {
        dir: convertDir,
        file: convertFile
    }
};