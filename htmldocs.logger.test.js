'use strict';

const chai = require('chai'), expect = chai.expect, assert = chai.assert;
const htmldocs = require('./htmldocs.logger.js');
const path = require('path');

describe('htmldocs', () => {

    describe('logger', () => {

        describe('init()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.init).exist;
            });

            it('should initialize the buffer', () => {
                htmldocs.init();
                chai.expect(htmldocs.buffer).to.equal('');
            });

        });

        describe('log()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.log).exist;
            });

            it('should write a line in buffer', () => {
                htmldocs.log('Hey');
                chai.assert(htmldocs.buffer !== '');
                chai.assert(htmldocs.buffer.indexOf('Hey') > -1);
                chai.assert(htmldocs.buffer.indexOf('\n') > -1);
            });

        });

        describe('done()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.done).to.exist;
            });

            it('should run all promises in series', (done) => {
                htmldocs.done('./test/logger').then(logger => {
                    chai.expect(logger.buffer).to.equal('');
                    done();
                });
            });

        });

    });

});