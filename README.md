chai-diff
=========

Adds expectations to [chai](http://chaijs.com/) which compare string or objects using [jsdiff](https://github.com/kpdecker/jsdiff).

```javascript
expect(oneString).diffLines(anotherString, options)
expect(oneObject).diffJson(anotherObject, options)
```

This will compare two strings or convert two objects to JSON strings and then compare them.

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

* Support more natural expectation syntax. If your chai-foo is more powerful than mine, please send me a pull request for that!
* More options for which whitespace to ignore
* An option to show less context around differences.
