chai-diff
=========

Adds expectations to [chai](http://chaijs.com/) which compare string or objects using [jsdiff](https://github.com/kpdecker/jsdiff).

```javascript
expect(value).differentFrom(another, options)
expect(value).not.differentFrom(another, options)
expect(value).to.be.differentFrom(another, options)
expect(value).not.to.be.differentFrom(another, options)
```

This will compare two strings or convert two objects to JSON strings and then compare them. One oddity is that the base form expects the objects to be different and you will generally use the `.not.differentFrom` form.

The `options` object is optional and can have the following keys:

* `showSpace [false]` Whether to convert whitespace to visible unicode characters.
* `relaxedSpace [false]` Whether to normalise whitespace before comparing strings. This
    - removes all leading whitespace
    - removes all trailing whitespace
    - replaces all sequences of whitespace with a single space
    - removes any empty lines

Usage
------------

Install in your project with

```
npm install chai-diff --save-dev
```

and in your specs add:

```javascript
chai.use(require('chai-diff'));
```

Why?
----

This is useful if:

* your test runner doesn't show useful differences on failures.
* you need better control over diffs than your runner supports.

TODO
----

Further improvements:

* More options for which whitespace to ignore
* An option to control the amount of context around differences.
