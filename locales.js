const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const klaw = require('klaw-sync');


const localesDir = 'locales';
const interpolateRegEx = /{{([\s\S]+?)}}/g;
const evaluateRegEx = /{%([\s\S]+?)%}/g;


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

  compile(text) {
    return _.template(text, {
      interpolate: interpolateRegEx,
      evaluate: evaluateRegEx
    });
  }

  compileFile(path) {
    return this.compile(fs.readFileSync(path, { encoding: 'utf8' }));
  }

  addTemplate(locale, name, template) {
    if (typeof this.text[locale] === 'undefined')
      this.text[locale] = {};
    this.text[locale][name] = template;
  }

  addFromLocalesDir(directory=localesDir) {
    for (let locale of this.locales) {
      let localePath = path.join(localesDir, locale.code);

      klaw(localePath, {
        nodir: true,
        filter: p => path.extname(p.path) === '.txt'
      }).forEach(p => {
        let name = path.basename(path.relative(localePath, p.path).replace(path.sep, ':'), '.txt');
        this.addTemplate(locale.code, name, this.compileFile(p.path));
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
}
