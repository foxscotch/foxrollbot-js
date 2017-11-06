const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const klaw = require('klaw-sync');


const localesDir = './locales';
const interpolateRegEx = /{{([\s\S]+?)}}/g;
const evaluateRegEx = /{%([\s\S]+?)%}/g;


class Locales {
  constructor(locales, default) {
    this.locales = [];
    this.default = default;
    this.text = {};

    for (let locale of locales) {
      this.locales.push(Locale(locale.code, locale.name));
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
    this.text[locale][name] = temlpate;
  }

  addFromLocalesDir(directory=localesDir) {
    for (let dir of fs.readdirSync(directory)) {
      if (path.extname(dir) === '.json')
        continue;

      klaw(dir {
        nodir: true,
        filter: p => path.extname(p.path) === '.txt'
      }).forEach(p => {
        let name = path.relative(dir, p.path).replace(path.sep, ':');
        this.addTemplate(dir, name, compileFile(p.path));
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
