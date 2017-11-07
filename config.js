const configFile = require('js-yaml').load(
  fs.readFileSync(process.env['FRB_CONFIG_FILE'] || './config.yaml', 'utf8')
);

module.exports = {
  locale: {
    locales:    configFile.locale.locales, // No default! You MUST use a config file!
                                           // If this value isn't in this config file, locales.js
                                           // will check in localesDir/meta.json.
    default:    process.env['FRB_DEFAULT_LOCALE'] || configFile.locale.default    || 'en-US',
    localesDir: process.env['FRB_LOCALES_DIR']    || configFile.locale.localesDir || './locales',
    interpolateRegEx: configFile.locale.interpolateRegEx || /{{([\s\S]+?)}}/g,
    evaluateRegEx:    configFile.locale.evaluateRegEx    || /{%([\s\S]+?)%}/g
  }
};
