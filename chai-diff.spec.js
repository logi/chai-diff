var chai = require('chai');
var expect = chai.expect;

var chaiDiff = require('./chai-diff.js');
chai.use(chaiDiff);

describe('chai-diff', function () {

    it('should accept identical strings', function () {
        expect('1234\n4321').not.differentFrom('1234\n4321');
    });

    it('should accept different strings', function () {
        expect('1234\n4321').differentFrom('4321\n1234');
    });

    it('should accept different strings', function () {
        var actual = [
            '1234',
            '4321'
        ].join('\n');
        var expected = [
            '1234',
            'abcd',
            '4321'
        ].join('\n');
        try {
            expect(actual).not.differentFrom(expected);
            expect(true).equals(false);  // Should have thrown exception
        } catch (e) {
            var str = e.toString();
            //console.log(str);
            expect(str).to.contain('Got 1 unexpected differences');
            expect(str).to.contain('- abcd');
        }
    });

    it('should accept identical objects', function () {
        expect({foo: 42, bar: 69}).not.differentFrom({foo: 42, bar: 69});
    });

    it('should accept different objects', function () {
        var actual = {
            foo: 42,
            zoo: 123,
            bar: 69
        };
        var expected = {
            foo: 42,
            zoo: 123,
            bar: 60,
            ööö: 'dót'
        };
        try {
            expect(actual).not.differentFrom(expected);
            expect(true).equals(false);  // Should have thrown exception
        } catch (e) {
            var str = e.toString();
            expect(str).to.contain('Got 2 unexpected differences');
            expect(str).to.contain('-   "bar": 60');
            expect(str).to.contain('+   "bar": 69');
            expect(str).to.contain('-   "ööö": "dót"');
        }
    });

    it('should allow natural syntax', function () {
        expect('123').differentFrom('321');
        expect('123').to.be.differentFrom('321');
        expect('123').not.differentFrom('123');
        expect('123').not.to.be.differentFrom('123');
        expect('123').to.not.be.differentFrom('123');
        expect('123').to.be.not.differentFrom('123');
    });

});