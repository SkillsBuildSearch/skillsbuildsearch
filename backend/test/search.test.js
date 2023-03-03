let imports = require('../src/api/search');

describe('ParseLength', () => {
  test('["3"] should result in [3]', () => {
    expect(imports.parseLength("3")).toBe(3)
    });
    test('[""] should result in [5]', () => {
        expect(imports.parseLength("")).toBe(5)
    });
    test('["0"] should result in [5]', () => {
        expect(imports.parseLength("0")).toBe(5)
    });
    test('["-1"] should result in [5]', () => {
        expect(imports.parseLength("-1")).toBe(5)
    });
    test('["1000"] should result in [5]', () => {
        expect(imports.parseLength("1000")).toBe(5)
    });
})

describe('MSE', () => {
    test('["3"] should result in [3]', () => {
        expect(imports.parseLength("3")).toBe(3)
    });
    test('[""] should result in [5]', () => {
        expect(imports.parseLength("")).toBe(5)
    });
    test('["0"] should result in [5]', () => {
        expect(imports.parseLength("0")).toBe(5)
    });
    test('["-1"] should result in [5]', () => {
        expect(imports.parseLength("-1")).toBe(5)
    });
    test('["1000"] should result in [5]', () => {
        expect(imports.parseLength("1000")).toBe(5)
    });
})