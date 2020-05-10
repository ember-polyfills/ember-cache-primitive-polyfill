'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/ember-cache-primitive-polyfill.js');
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
