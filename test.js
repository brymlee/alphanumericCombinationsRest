const counter = require('./index.js').counter
const countTill = require('./index.js').countTill
const combinations = require('./index.js').combinations
test('sanity check', () => expect(1).toBe(1))
test('when counting and target is 1 and base is 10 then should return 2', () => expect(counter(1, 10)).toBe('2'))
test('when counting and target is 9 and base is 16 then should return A', () => expect(counter(9, 16)).toBe('A'))
test('when counting and target is A and base is 16 then should return B', () => expect(counter('A', 16)).toBe('B'))
test('when counting and target is 19 and base is 16 then should return 1A', () => expect(counter(19, 16)).toBe('1A'))
test('when counting and target is F and base is 16 then should return 10', () => expect(counter('F', 16)).toBe('10'))
test('when counting till and target is AA and base is 16 then should have the appropriate numbers', () => {
	const actualNumbers = countTill('1A', 16)
	const expectedNumbers = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
				  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A' ]
	expect(actualNumbers).toEqual(expect.arrayContaining(expectedNumbers))
})
test('when counting and target is \'0\' and base is 10 then should return 1', () => expect(counter('0', 10)).toBe('1'))
test('when finding combinations of 2 digits and base 10 then should have appropriate numbers', () => { 
	expect(combinations(2, 10)).toHaveLength(45)
})

