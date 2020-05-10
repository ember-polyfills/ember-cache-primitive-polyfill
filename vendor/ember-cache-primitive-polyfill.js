import Ember from 'ember';
import { DEBUG } from '@glimmer/env';
import { assert } from '@ember/debug';
import { gte } from 'ember-compatibility-helpers';

(function() {
  let track, valueForTag, validateTag, consumeTag, isConstTag;

  if (gte('3.17.0-beta.1')) {
    let validator = Ember.__loader.require('@glimmer/validator');

    track = validator.track;
    valueForTag = validator.valueForTag || validator.value;
    validateTag = validator.validateTag || validator.validate;
    consumeTag = validator.consumeTag || validator.consume;
    isConstTag = validator.isConstTag;
  } else if (gte('3.13.0-beta.1')) {
    let metal = Ember.__loader.require('@ember/-internals/metal');
    let reference = Ember.__loader.require('@glimmer/reference');

    track = metal.track;
    consumeTag = metal.consume;
    valueForTag = reference.value;
    validateTag = reference.validate;
    isConstTag = reference.isConstTag;
  } else if (DEBUG) {
    throw new Error('Attempted to use cache polyfill with unsupported Ember version');
  }

  class Cache {
    __lastValue;
    __tag;
    __snapshot = -1;

    constructor(fn) {
      this.__fn = fn;
    }
  }

  Ember._createCache = function createCache(fn) {
    return new Cache(fn);
  }

  Ember._cacheGetValue = function getValue(cache) {
    if (DEBUG) {
      assert(
        `getValue() can only be used on an instance of a cache created with createCache(). Called with: ${String(
          cache
        )}`,
        cache instanceof Cache
      );
    }

    let { __tag: tag, __snapshot: snapshot, __fn: fn } = cache;

    if (tag === undefined || !validateTag(tag, snapshot)) {
      tag = track(() => (cache.__lastValue = fn()));
      cache.__tag = tag;
      cache.__snapshot = valueForTag(tag);
      consumeTag(tag);
    } else {
      consumeTag(tag);
    }

    return cache.__lastValue;
  }

  Ember._cacheIsConst = function isConst(cache) {
    if (DEBUG) {
      assert(
        `isConst() can only be used on an instance of a cache created with createCache(). Called with: ${String(
          cache
        )}`,
        cache instanceof Cache
      );

      assert(
        `isConst() can only be used on a cache once getValue() has been called at least once. Called with cache function:\n\n${String(
          cache.__fn
        )}`,
        cache.__tag
      );
    }

    return isConstTag(cache.__tag);
  }
})();
