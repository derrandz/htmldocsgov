'use strict';

const q = require('q');
const async = require('async');
const mammoth = require('mammoth');
const filesystem = require('fs');

/**
 * @param  {Array(Function)} promises
 * @param  {Function} seriesCallback
 * @return {Promise}
 */
let serial = (promises, seriesCallback) => {
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
};

/**
 * Writes a file to the path that is the supplied path with the supplied value.
 * @param  {String} filepath
 * @param  {String} html
 * @return {Promise}
 */
let writeFile = function (filepath, content, encoding="utf-8") {
    let deferred = q.defer();
    
    filesystem.writeFile(filepath, content, encoding, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(filepath);
        }
    });

    return deferred.promise;
};

/**
 * @param  {String} filepath
 * @param  {String} content
 * return {Promise}
 */
let appendFile = function (filepath, content) {
    let deferred = q.defer();

    filesystem.appendFile(filepath, content, function (err) {
        if (err) {
            deferred.reject({
                status: 'ERROR',
                reason: err
            });
        } else {
            deferred.resolve({
                status: 'OK',
                value: filepath
            });
        }
    });

    return deferred.promise;
};

/**
 * Exporting a utility object.
 */
module.exports = {
    writeFile: writeFile,
    appendFile: appendFile,
    serial: serial
};