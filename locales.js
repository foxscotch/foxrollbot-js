const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const klaw = require('klaw-sync');

const conf = require('./config').locale;


class Locales {
  constructor(locales, defaultLocale) {
    this.locales = locales.map(l => new Locale(l.code, l.name));
    this.default = defaultLocale;
    this.text = {};
  }

  static createFromConfig() {
    if (typeof conf.locales === 'undefined')
      conf.locales = require(path.join(conf.localesDir, 'meta.json'));
    return new Locales(conf.locales, conf.default).addFromLocalesDir();
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

    return this;
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
