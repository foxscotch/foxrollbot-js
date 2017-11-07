const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const klaw = require('klaw-sync');

const conf = require('./config').locales;


class Locales {
  constructor(locales, defaultLocale) {
    this.locales = [];
    this.default = defaultLocale;
    this.text = {};

    for (let locale of locales) {
      this.locales.push(new Locale(locale.code, locale.name));
    }
  }

  getText(name, locale=this.default, context={}) {
    return this.text[locale][name](context)
  }

  static compile(text) {
    return _.template(text, {
      interpolate: conf.interpolateRegEx,
      evaluate: conf.evaluateRegEx
    });
  }

  static compileFile(path) {
    return Locales.compile(fs.readFileSync(path, { encoding: 'utf8' }));
  }

  addTemplate(locale, name, template) {
    if (typeof this.text[locale] === 'undefined')
      this.text[locale] = {};
    this.text[locale][name] = template;
  }

  addFromLocalesDir(directory=conf.localesDir) {
    for (let locale of this.locales) {
      let localePath = path.join(directory, locale.code);

      klaw(localePath, {
        nodir: true,
        filter: p => path.extname(p.path) === '.txt'
      }).forEach(p => {
        let name = path.basename(path.relative(localePath, p.path).replace(path.sep, ':'), '.txt');
        this.addTemplate(locale.code, name, Locales.compileFile(p.path));
      });
    }
  }
}


class Locale {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}


module.exports = {
  Locales,
  Locale
};
