const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const klaw = require('klaw-sync');

const config = require('./config');
const { interpolateRegEx, evaluateRegEx } = config.templates


/** Represents a set of locales.
 * @property {Object[]} locales - List of locales.
 * @property {string} default - Human-readable name for the locale.
 * @property {Object} text - Object containing the templates for each locale.
 */
class Locales {
  /**
   * Create a set of locales.
   * @param {Object[]} locales - List of locales to use.
   * @param {string} locales[].code - Locale code for the locale.
   * @param {string} locales[].name - Human-readable name for the locale.
   * @param {string} defaultLocale - Default locale to use in Locales#getText.
   */
  constructor(locales, defaultLocale) {
    this.locales = locales.map(l => new Locale(l.code, l.name));
    this.text = {};

    const foundLocale = this.findLocale(defaultLocale);
    if (typeof foundLocale === 'undefined')
      throw new Error('The configured default locale does not exist in the configured locales.');
    else
      this.default = defaultLocale;
  }

  /**
   * Instantiates a Locales object using the information in the config file.
   * @returns {Locales} The created Locales object.
   */
  static createFromConfig() {
    if (typeof config.locale.locales === 'undefined')
      config.locale.locales = require(path.join(config.locale.localesDir, 'meta.json'));
    return new Locales(config.locale.locales, config.locale.default).addFromLocalesDir();
  }

  /**
   * Compiles a template.
   * @param {string} text - Template text to compile.
   * @returns {function} The compiled template.
   */
  static compile(text) {
    return _.template(text, {
      interpolate: interpolateRegEx,
      evaluate: evaluateRegEx
    });
  }

  /**
   * Compiles a template from a file.
   * @param {string} path - Path of template file. It should end with a .txt extension.
   * @returns {function} The compiled template.
   */
  static compileFile(path) {
    return Locales.compile(fs.readFileSync(path, { encoding: 'utf8' }));
  }

  /**
   * Finds and returns a locale in this object's list of locales.
   * @param {string} localeCode - Locale code to search for.
   * @returns {Locale} The matched Locale, else undefined.
   */
  findLocale(localeCode) {
    return _.find(this.locales, v => v.code === localeCode);
  }

  /**
   * Runs the template for the chosen text name and locale. If the text does not exist for the
   * chosen locale, or locale is unspecified, it uses the default locale instead.
   * @param {string} name - Name of the text to retrieve.
   * @param {string} [locale=Locales#default] - Locale code to find the text in. 
   * @param {Object} [context] - Template context.
   */
  getText(name, locale=this.default, context={}) {
    return this.text[locale][name](context)
  }

  /**
   * Adds a template to Locales#text for the chosen locale and text name.
   * @param {string} locale - Locale to add the text for.
   * @param {string} name - Name to use for the text.
   * @param {function} template - Template to add.
   */
  addTemplate(locale, name, template) {
    if (typeof this.text[locale] === 'undefined')
      this.text[locale] = {};
    this.text[locale][name] = template;
  }

  /**
   * Adds templates from a locales directory. The root of the directory should contain folders with
   * the names in the locales configuration, and those folders should contain the templates to be
   * compiled.
   * @param {string} directory - The directory to compile templates from.
   * @returns {Locales} Returns the Locales object it was called on, for chaining.
   */
  addFromLocalesDir(directory=config.locale.localesDir) {
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


/** Represents a single locale.
 * @property {string} code - Locale code for the locale.
 * @property {string} name - Human-readable name for the locale.
 */
class Locale {
  /**
   * Create a locale.
   * @param {string} code - Locale code for the locale.
   * @param {string} name - Human-readable name for the locale.
   */
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}


module.exports = {
  Locales,
  Locale
};
