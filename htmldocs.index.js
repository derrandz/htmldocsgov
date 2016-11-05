'use strict';

const logger = require('./htmldocs.logger.js');
const govService = require('./htmldocs.service.js');

const govDirPath = require('./config/path.json').directory;

/**
 * @param {Object} result       An object containing warning/error messages and html value of the doc
 * @return {String}             An html string resulting from the doc conversion.
 */
let log = function (result) {
    logger.log(result.filename, result.logs);
    return result;
};

/**
 * @param {Object} result       An object containing warning/error messages and html value of the doc
 * @return
 */
let store = function (result) {
    return govService.writeFile(result.filename, result.html);
};

let htmldocs = govService.convert.dir({path: govDirPath});


htmldocs
    .then(files => files.map(log))
    .then(files => files.map(store))
    .done();