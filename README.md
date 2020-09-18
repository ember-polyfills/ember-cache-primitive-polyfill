ember-cache-primitive-polyfill
==============================================================================

Polyfills Ember's [cache primitive API](https://github.com/emberjs/rfcs/blob/master/text/0615-autotracking-memoization.md).

> Provides a low-level primitive for memoizing the result of a function based
> on autotracking, allowing users to create their own reactive systems that can
> respond to changes in autotracked state.

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.13 or above (inert for Ember 3.22+)
* `ember-cli-babel` v7.22.1 or above
* Ember CLI v3.8 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-cache-primitive-polyfill
```

Usage
------------------------------------------------------------------------------

```js
import { tracked } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

let computeCount = 0;

class Person {
  @tracked firstName = 'Jen';
  @tracked lastName = 'Weber';

  #fullName = createCache(() => {
    ++computeCount;
    return `${this.firstName} ${this.lastName}`;
  })

  get fullName() {
    return getValue(this.#fullName);
  }
}

let person = new Person();

console.log(person.fullName); // Jen Weber
console.log(count); // 1;
console.log(person.fullName); // Jen Weber
console.log(count); // 1;

person.firstName = 'Jennifer';

console.log(person.fullName); // Jennifer Weber
console.log(count); // 2;
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
