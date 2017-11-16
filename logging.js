const fs = require('fs');

const _ = require('lodash');

const conf = require('./config');


/**
 * Interface for writing logs.
 * @interface ILogWriter
 */
class ILogWriter {
  /**
   * Logs the log entry.
   * @param {number|Date} timestamp - Time of log. If a Date is passed, it should use timestamp.getTime().
   * @param {string} text - Text to log.
   */
  log(timestamp, text) {
    throw new Error('Not implemented.');
  }
}


/**
 * Class for writing logs to files.
 * @implements ILogWriter
 * @property {string} level - Log level for this writer to write at.
 * @property {string} file - Path of file to write logs to.
 * @property {string} template - Template that logs are written with.
 */
class FileLogWriter {
  /**
   * Constructs a FileLogWriter.
   * @param {string} level - Log level for this writer to write at.
   * @param {string} path - Path of file to write logs to.
   * @param {string} [format='{{ level }} {{ timestamp }}: {{ text }}'] - String for format of logs, used as a Lodash template. A newline is added automatically.
   */
  constructor(level, path, format='{{ level }} {{ timestamp }}: {{ text }}') {
    this.level = level;
    this.file = fs.createWriteStream(path, { mode: 'a', encoding: 'utf8' });
    this.template = _.template(format + '\n', {
      interpolate: conf.locale.interpolateRegEx
    });
  }
}


class Logger {
  constructor() {}
}
