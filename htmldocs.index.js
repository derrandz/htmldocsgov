'use strict';

const logger = require('./htmldocs.logger.js');
const htmldocsService = require('./htmldocs.service.js');
const htmldocsPaths = require('./config/path.json').directory;

/**
 * @param {Object} result       An object containing warning/error messages and html value of the doc
 * @return {String}             An html string resulting from the doc conversion.
 */
let log = function (result) {
    logger.log(` ${result.filename} // ${result.logs}`);
    return result;
};

/**
 * Saves the .docx files under .html after the conversion
 * @param {Object} result       An object containing warning/error messages and html value of the doc
 * @return {Promise}
 */
let store = function (result) {
    return htmldocsService.writeFile(`${htmldocsPaths.output}/${result.filename}`, result.html);
};

/**
 * The converted .docx to html in the specified dir.
 * @type {Promise};
 */
let htmldocs = htmldocsService.convert.dir({path: htmldocsPaths.input});

htmldocs
    .then(files => files.map(log))
    .then(files => files.map(store))
    .done();