const fs = require('fs');
const path = require('path');

const _ = require('lodash');


const localesFolder = './locales';


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
      interpolate: /{{([\s\S]+?)}}/g,
      evaluate: /{%([\s\S]+?)%}/g
    });
  }
}


class Locale {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}
