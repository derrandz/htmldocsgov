'use strict';

const chai = require('chai'), expect = chai.expect, assert = chai.assert;
const htmldocs = require('./htmldocs.service.js');
const path = require('path');

describe('htmldocs', () => {

    describe('__utils Object', () => {

        it('should exist', () => {
            chai.expect(htmldocs.__utils).to.exist;
        });

        describe('parseFilename()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.__utils.parseFilename).to.exist;
            });

            it('should return file name from fullpath', () => {
                chai.expect(htmldocs.__utils.parseFilename('/path/to/file.docx')).to.equal('file.docx');
            });

        });

        describe('serial()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.__utils.serial).to.exist;
            });

            it('should run all promises in series', (done) => {
                htmldocs.__utils.serial([
                    function (cb) {
                        Promise.resolve({result: 1}).then((res) => {
                            cb(null, res);
                        })
                    },
                    function (cb) {
                        Promise.resolve({result: 2}).then((res) => {
                            cb(null, res)
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

    let html;
    describe('convert Object', () => {

        it('should exist', () => {
            chai.expect(htmldocs.convert).to.exist;
        });

        describe('file()', () => {
            it('should exist', () => {
                chai.expect(htmldocs.convert.file).to.exist;
            });

            it('should convert a .docx to .html', done => {
                htmldocs.convert.file(path.join(__dirname, "test", "service", "file.docx")).then((result) => {
                    chai.expect(result).to.have.property('html');
                    chai.expect(result).to.have.property('logs');
                    chai.expect(result).to.have.property('filename').to.equal('file.docx');
                    html = result.html;
                    done();
                });
            });
        });

        describe('dir()', () => {

            it('should exist', () => {
                chai.expect(htmldocs.convert.dir).to.exist;
            });

            it('should convert a dir/*.docx to .html', done => {
                htmldocs.convert.dir(path.join(__dirname, "test", "service", "dir")).then(results => {
                    chai.expect(results).to.be.an('array');
                    results.forEach(res => {
                        chai.expect(res).to.have.property('html');
                        chai.expect(res).to.have.property('logs');
                        chai.expect(res).to.have.property('filename');
                    });
                }).done(done);
            });

        });

    });

    describe('writeFile()', () => {

        it('should exist', () => {
            chai.expect(htmldocs.writeFile).to.exist;
        });

        it('should convert save the html to ./test/service/saved.html', done => {
            htmldocs.writeFile(path.join(__dirname, "test", "service", "saved.html"), html).then(x => {
                done();
            });
        });

    });

});