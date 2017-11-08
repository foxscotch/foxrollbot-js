const yaml = require('js-yaml');


const configFile = yaml.load(
  fs.readFileSync(process.env['FRB_CONFIG_FILE'] || './config.yaml', 'utf8')
);

module.exports = {
  locale: {
    locales:          configFile.locale.locales          || [{ code: 'en-US', name: 'US English'}],
    default:          configFile.locale.default          || 'en-US',
    localesDir:       configFile.locale.localesDir       || './locales',
    interpolateRegEx: configFile.locale.interpolateRegEx || /{{([\s\S]+?)}}/g,
    evaluateRegEx:    configFile.locale.evaluateRegEx    || /{%([\s\S]+?)%}/g
  }
};
