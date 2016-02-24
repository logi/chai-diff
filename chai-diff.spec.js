var chai = require('chai');
var expect = chai.expect;

var chaiDiff = require('./chai-diff.js');
chai.use(chaiDiff);

describe('chai-diff', function () {

    it('accepts identical strings', function () {
        expect('1234\n4321').not.differentFrom('1234\n4321');
    });

    it('accepts different strings', function () {
        expect('1234\n4321').differentFrom('4321\n1234');
    });

    it('accepts different strings', function () {
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

    it('accepts identical objects', function () {
        expect({foo: 42, bar: 69}).not.differentFrom({foo: 42, bar: 69});
    });

    it('accepts different objects', function () {
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
            expect(str).to.contain('Got 1 unexpected differences');
            expect(str).to.contain('-   "bar": 60');
            expect(str).to.contain('+   "bar": 69');
            expect(str).to.contain('-   "ööö": "dót"');
        }
    });

    it('allows natural syntax', function () {
        expect('123').differentFrom('321');
        expect('123').to.be.differentFrom('321');
        expect('123').not.differentFrom('123');
        expect('123').not.to.be.differentFrom('123');
        expect('123').to.not.be.differentFrom('123');
        expect('123').to.be.not.differentFrom('123');
    });

    it('supports variable amount of context at beginning and end', function () {
        var r = chaiDiff.diffLines(
            '123\n234\n345\n456\n567\n678\n789\n890\n901',
            '123\n234\n345\n456\nXXX\n678\n789\n890\n901', {
                context: 2
            });
        expect(r.diffStr).equal(
            '  ⋮\n' +
            '  345\n' +
            '  456\n' +
            '- 567\n' +
            '+ XXX\n' +
            '  678\n' +
            '  789\n' +
            '  ⋮'
        );
        expect(r.diffCount).equal(1);
    });

    it('supports variable amount of context in middle', function () {
        var r = chaiDiff.diffLines(
            '123\n234\n345\n456\n567\n678\n789\n890\n901\n012',
            '123\nXXX\n345\n456\n567\n678\n789\n890\nXXX\n012', {
                context: 2
            });
        expect(r.diffStr).equal(
            '  123\n' +
            '- 234\n' +
            '+ XXX\n' +
            '  345\n' +
            '  456\n' +
            '  ⋮\n' +
            '  789\n' +
            '  890\n' +
            '- 901\n' +
            '+ XXX\n' +
            '  012'
        );
        expect(r.diffCount).equal(2);
    });

    it('supports variable amount of context flowing together', function () {
        var r = chaiDiff.diffLines(
            '123\n234\n345\n456\n567\n678\n789',
            '123\nXXX\n345\n456\n567\nXXX\n789',
            {
                context: 2
            }
        );
        expect(r.diffStr).equal(
            '  123\n' +
            '- 234\n' +
            '+ XXX\n' +
            '  345\n' +
            '  456\n' +
            '  567\n' +
            '- 678\n' +
            '+ XXX\n' +
            '  789'
        );
        expect(r.diffCount).equal(2);
    });

    it('shows no newline on inserted vertical ellipsis', function () {
        var r = chaiDiff.diffLines(
            '123\n234\n345\n456\n567\n678\n789\n890\n901',
            '123\n234\n345\n456\nXXX\n678\n789\n890\n901', {
                context: 2,
                showSpace: true
            });
        expect(r.diffStr).equal(
            '  ⋮\n' +
            '  345↩\n' +
            '  456↩\n' +
            '- 567↩\n' +
            '+ XXX↩\n' +
            '  678↩\n' +
            '  789↩\n' +
            '  ⋮'
        );
        expect(r.diffCount).equal(1);
    });

});