import * as Util from './util.js'

test("caseInsensitiveStringCompare base", function() {
    const testCases = [
        ["A", "A", 0],
        ["a", "a", 0],
        ["A", "a", 0],
        ["a", "A", 0],

        ["A", "B", -1],
        ["a", "b", -1],
        ["A", "b", -1],
        ["a", "B", -1],

        ["B", "A", 1],
        ["b", "a", 1],
        ["B", "a", 1],
        ["b", "A", 1],
    ];

    testCases.forEach(function([a, b, expected]) {
        expect(Util.caseInsensitiveStringCompare(a, b)).toBe(expected);
    });
});
