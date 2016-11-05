'use strict';

const filesystem = require('fs');
const moment = require('moment');
const writeFile = require('./htmldocs.utils.js').writeFile;

/**
 * Initializes the buffer.
 * @return {Object}
 */
let init = function () {
    this.buffer = '';
    return this;
};

/**
 * Writes a line to the buffer.
 * @param {String} message
 * @return {Object}
 */
let log = function (message) {
    this.buffer += `\n[${moment().format('YYYY-DD-MM hh:mm').toString()}]: ${message}`;
    return this;
};

/**
 * Writes the contents of the buffer to a file in ./logs with a timestamp.
 * Empties the buffer.
 * @return {Promise}
 */
let done = function (customPath) {
    var logger = this;
    let path = customPath || "./logs";
    return writeFile(`${path}/${moment().format('YYYYDDMMhhmm').toString()}.log`, logger.buffer).then(r => {
        logger.init();
        return this;
    });
};

let logger = {
    buffer: '',
    init: init,
    log: log,
    done: done
};

module.exports = logger;