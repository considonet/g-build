const timestamp = require('time-stamp');
const cGray = require('ansi-gray');
const cCyan = require('ansi-cyan');
const cBold = require('ansi-bold');
const cRed = require('ansi-red');
const cYellow = require('ansi-yellow');
const supportsColor = require('color-support');

class Logger {

  constructor(moduleName, verbosity) {
    this.verbosity = verbosity;
    this.moduleName = moduleName;
  }

  _addColor(c, str) {

    if (supportsColor()) {
      return c(str);
    }

    return str;

  }

  _getMessage(message) {
    return `[\x1b[2m${this._addColor(cGray, timestamp('HH:mm:ss'))}\x1b[0m] ` + (this.moduleName ? `${this._addColor(cCyan, this.moduleName)}: ${message}`: message);
  }

  log(message, level = 1) {

    if(level<=this.verbosity) {
      console.log(this._getMessage(level===0 ? this._addColor(cBold, message) : message));
    }

  }

  warn(message) {
    console.warn(this._getMessage(this._addColor(cYellow, message)));
  }

  error(message) {
    console.error(this._getMessage(this._addColor(cRed, message)));
  }

}

module.exports = Logger;