const fs = require('fs');
const path = require('path');

const _ = require('lodash');


const localesFolder = './locales';


class Locales {
  constructor(locales, default) {
    this.locales = [];
    this.default = default;

    for (let locale of locales) {
      this.locales.push(Locale(locale.code, locale.name));
    }
  }

  getText(textName, context={}, locale=this.default) {
    return this.text[locale][textName](context)
  }

  compileTemplate(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
        if (err)
          reject(err);
        else
          resolve(_.template(data));
      });
    });
  }
}


class Locale {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}
