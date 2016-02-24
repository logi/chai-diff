/**
 * Chai plugin for comparing strings using the JsDiff library.
 *
 * It gives descriptive error messages for differences in long strings.
 */
"use strict";

// Boilerplate to support AMD (RequireJS), CommonJD (Node) and global cariables.
// http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["diff"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("diff"));
    } else {
        root.chaiDiff = factory(root.diff);
    }
}(this, function (diff) {

    diff = diff || window.JsDiff;

    var chaiDiff = function (chai) {

        var Assertion = chai.Assertion;

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
            var actualStr = chaiDiff.stringify(this._obj);
            var expectedStr = chaiDiff.stringify(expected);
            var result = chaiDiff.diffLines(expectedStr, actualStr, options);
            this.assert(
                result.diffCount != 0,
                'Strings were unexpectedly identical:\n' + actualStr,
                'Got ' + result.diffCount + ' unexpected differences:\n' + result.diffStr
            );
        });

    };

    chaiDiff.stringify = function (v) {
        if (typeof(v) === 'string') {
            return v;
        }
        return JSON.stringify(v, null, 2);
    };

    /** Normalize white space in strings for relaxed comparison. */
    chaiDiff.normalize = function (s) {
        return s
            .replace(/[ \t​]+/g, ' ')     // Replace all horizontal whitespace with single space
            .replace(/[\f\r\v]/g, '\n')  // Replace all vertical whitespace with newline
            .replace(/\n[ ​]/g, '\n')     // Remove whitespace at beginning of line
            .replace(/[ ]\n/g, '\n')     // Remove whitespace at end of line
            .replace(/^[ ​\n]*/g, '')     // Remove whitespace at beginning of string
            .replace(/[ \n]*$/g, '')     // Remove whitespace at end of string
            .replace(/[\n\f\r\v]+/g, '\n');  // Remove empty lines (may have contained spaces before)
    };

    var NONE = null,
        CTX = '  ',
        ADD = '+ ',
        SUB = '- ';

    chaiDiff.diffLines = function (expected, actual, options) {
        if (options == undefined) {
            options = {};
        }
        var showSpace = !!options.showSpace;
        var relaxedSpace = !!options.relaxedSpace;

        // Stringify and normalize objects
        if (relaxedSpace) {
            actual = chaiDiff.normalize(actual);
            expected = chaiDiff.normalize(expected);
        }

        var diffParts = diff.diffLines(expected, actual);
        var diffStr = [];
        var diffCount = 0;
        var lastAction = NONE;
        var lastPart = NONE;
        diffParts.forEach(function (part) {
            var action = CTX;
            if (part.added) {
                action = ADD;
                if (lastAction !== SUB) {
                    diffCount++;
                }
            } else if (part.removed) {
                action = SUB;
                if (lastAction !== ADD) {
                    diffCount++;
                }
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
            lastAction = action;
            lastPart = part;
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
    };

    return chaiDiff

}));

