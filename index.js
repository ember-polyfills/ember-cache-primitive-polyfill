'use strict';

const SilentError = require('silent-error');
const VersionChecker = require('ember-cli-version-checker');
const NATIVE_SUPPORT_VERSION = '3.22.0-alpha.1';
let hasBeenWarned = false;

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    const parentChecker = new VersionChecker(this.parent);
    const babelVersion = parentChecker.for('ember-cli-babel');

    if (babelVersion.lt('7.20.0')) {
      throw new SilentError('ember-cache-primitive-polyfill requires ember-cli-babel@7.20.0 or higher in order to function properly, please update your ember-cli-babel version');
    }

    let glimmerTrackingVersion = parentChecker.for('@glimmer/tracking');
    if (glimmerTrackingVersion.lt('1.0.2')) {
      this.ui.writeWarnLine(`Using ${this.name} with \`@glimmer/tracking\` versions prior to 1.0.2 may not work correctly, please update to at least \`@glimmer/tracking@1.0.2\``);
    }

    const projectChecker = new VersionChecker(this.project);
    const emberVersion = projectChecker.for('ember-source');

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
