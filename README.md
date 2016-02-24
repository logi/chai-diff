#chai-diff

Adds expectations to [chai](http://chaijs.com/) which compare string or objects using [jsdiff](https://github.com/kpdecker/jsdiff).

```javascript
expect(value).differentFrom(another, options)
expect(value).not.differentFrom(another, options)
expect(value).to.be.differentFrom(another, options)
expect(value).not.to.be.differentFrom(another, options)
```

This will compare two strings or convert two objects to JSON strings and then compare them. One oddity is that the base form expects the objects to be different and you will generally use the `.not.differentFrom` form.

The `options` object is optional and can have the following flags:

* `showSpace [false]` Whether to convert whitespace to visible unicode characters in output.
* `relaxedSpace [false]` Whether to normalise whitespace before comparing strings. This
    - removes all leading whitespace
    - removes all trailing whitespace
    - replaces all sequences of whitespace with a single space
    - removes any empty lines

## Installation in Node (CommonJS)

```bash
npm install chai-diff --save-dev
```

and in your specs add:

```javascript
chai.use(require('chai-diff'));
```

See `chai-diff.spec.js` for an example

## Installation in RequireJS (AMD)

Download the chai-diff.js file and add it to your main. Then in your test do something like:

```javascript
define(['chai', 'chai-diff', ...], function(chai, chaiDiff, ...) {
  chai.use(chaiDiff);

  describe(...);

});
```

## Installation in browsers

Finally, if neither CommonJS nor AMD is detected, a global varialbe `chaiDiff` is created and can be used with:

```javascript
<script src="chai.js"></script>
<script src="diff.js"></script>
<script src="chai-diff.js"></script>
<script>
    chai.use(chaiDiff);
    ...
</script>
```

See `test.html` for an example

## Why?

This is useful if:

* You need to ignore white space in string comparisons
* Your test runner doesn't show useful differences on failures.

## TODO

Further improvements:

* More options for which whitespace to ignore
* An option to control the amount of context around differences.
