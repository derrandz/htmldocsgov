'use strict';

const chai = require('chai'), expect = chai.expect, assert = chai.assert;
const htmldocs = require('./htmldocs.utils.js');
const path = require('path');

describe('htmldocs', () => {

    describe('utils', () => {

        describe('writeFile()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.writeFile).exist;
            });

            it('should write file in ./test/utils/file.txt', done => {
                htmldocs.writeFile('./test/utils/file.txt', 'htmldocs.utils.test.js writeFile() PASSED OK').then((r) => {
                    done();
                });
            });

        });

        describe('appendFile()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.appendFile).exist;
            });

            it('should write file in ./test/utils/file.txt', done => {
                htmldocs.appendFile('./test/utils/file.txt', 'htmldocs.utils.test.js appendFile() PASSED OK').then((r) => {
                    done();
                });
            });

        });

        describe('serial()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.serial).to.exist;
            });

            it('should run all promises in series', (done) => {
                htmldocs.serial([
                    function (cb) {
                        Promise.resolve({result: 1}).then((res) => {
                            cb(null, res);
                        })
                    },
                    function (cb) {
                        Promise.resolve({result: 2}).then((res) => {
                            cb(null, res);
                        });
                    }
                ]).then(results => {
                    chai.expect(results).to.be.an('array');
                    results.forEach(function (res) {
                        chai.expect(res).to.have.property('result');
                    });
                    done();
                });
            });

        });

    });

});