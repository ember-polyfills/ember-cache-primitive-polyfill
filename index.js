'use strict';

const VersionChecker = require('ember-cli-version-checker');
const NATIVE_SUPPORT_VERSION = '3.22.0-alpha.1';
let hasBeenWarned = false;

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    const checker = new VersionChecker(this);
    const emberVersion = checker.for('ember-source');

    if (emberVersion.lt(NATIVE_SUPPORT_VERSION)) {
      this.import('vendor/ember-cache-primitive-polyfill.js');
    } else if (this.parent === this.project && !hasBeenWarned) {
      this.ui.writeWarnLine(
        `${this.name} is not required for Ember ${NATIVE_SUPPORT_VERSION} and later, please remove from your 'package.json'.`
      );
      hasBeenWarned = true;
    }
  },

  treeForVendor(rawVendorTree) {
    let babelAddon = this.addons.find(
      addon => addon.name === 'ember-cli-babel'
    );

    let transpiledVendorTree = babelAddon.transpileTree(rawVendorTree, {
      babel: this.options.babel,

      'ember-cli-babel': {
        compileModules: false,
      },
    });

    return transpiledVendorTree;
  },
};
