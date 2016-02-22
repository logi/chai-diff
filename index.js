/**
 * Chai plugin for comparing strings using the JsDiff library.
 *
 * It gives descriptive error messages for differences in long strings.
 */

"use strict";

var diff = require('diff');

module.exports = function (chai) {
    var Assertion = chai.Assertion;

    function stringify(v) {
        if (typeof(v) === 'string') {
            return v;
        }
        return JSON.stringify(v, null, 2);
    }

    /** Normalize white space in strings for relaxed comparison. */
    function normalize(s) {
        return s
            .replace(/[ \t​]+/g, ' ')     // Replace all horizontal whitespace with single space
            .replace(/[\f\r\v]/g, '\n')  // Replace all vertical whitespace with newline
            .replace(/\n[ ​]/g, '\n')     // Remove whitespace at beginning of line
            .replace(/[ ]\n/g, '\n')     // Remove whitespace at end of line
            .replace(/^[ ​\n]*/g, '')     // Remove whitespace at beginning of string
            .replace(/[ \n]*$/g, '')     // Remove whitespace at end of string
            .replace(/[\n\f\r\v]+/g, '\n');  // Remove empty lines (may have contained spaces before)
    }

    function diffLines(actual, expected, options) {
        if (options == undefined) {
            options = {};
        }
        var showSpace = !!options.showSpace;
        var relaxedSpace = !!options.relaxedSpace;

        // Stringify and normalize objects
        if (relaxedSpace) {
            actual = normalize(actual);
            expected = normalize(expected);
        }

        var diffParts = diff.diffLines(expected, actual);
        var diffStr = [];
        var diffCount = 0;
        diffParts.forEach(function (part) {
            var action = '  ';
            if (part.added) {
                action = '+ ';
                diffCount++;
            } else if (part.removed) {
                action = '- ';
                diffCount++;
            }
            var value = part.value;
            if (showSpace) {
                value = value.replace(/ /g, '·');
                value = value.replace(/\t/g, '  → ');
                value = value.replace(/\n/g, '↩\n');
            }

            // Add +, - or space at the beginning of each line in value.
            // and make sure it ends with \n to not run into the next one
            // you will need to enable showSpace to see this difference!
            value = action + value.replace(/\n(.)/g, '\n' + action + '$1');
            if (value.charAt(value.length - 1) !== '\n') {
                value += '\n';
            }
            diffStr.push(value);
        });

        // Remove any trailing line-feeds which we may have over-zelously added above
        diffStr = diffStr.join('');
        while (diffStr.charAt(diffStr.length - 1) == '\n') {
            diffStr = diffStr.substr(0, diffStr.length - 1);
        }

        return {
            diffCount: diffCount,
            diffStr: diffStr
        }
    }

    /**
     * Diff the actual value against an expected value line by line and if different,
     * show a full difference with lines added and lines removed. If non-string values
     * as being compared they are JSON stringified first.
     *
     * Takes an optional options object with flags for:
     *   - showSpace (false) whether to replace whitespace with unicode dots and arrows
     *   - relaxedSpaces (false) whether to normalize strings before comparing them.
     *         This is removes empty lines, removes spaces from beginning and end of lines
     *         and compresses sequences of white-space to a single space.
     */
    Assertion.addMethod('differentFrom', function (expected, options) {
        var actualStr = stringify(this._obj);
        var expectedStr = stringify(expected);
        var result = diffLines(actualStr, expectedStr, options);
        this.assert(
            result.diffCount != 0,
            'Strings were unexpectedly identical:\n' + actualStr,
            'Got ' + result.diffCount + ' unexpected differences:\n' + result.diffStr
        );
    });

};