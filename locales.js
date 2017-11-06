const fs = require('fs');
const path = require('path');

const _ = require('lodash');


const localesFolder = './locales';
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
}


class Locale {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}
