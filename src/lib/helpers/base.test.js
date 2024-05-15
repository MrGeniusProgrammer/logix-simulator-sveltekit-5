import { describe } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { base10toBase2, base2toBase10, getAllPossibleBinaryCombinations } from './base';

describe.skip('getAllPossibleBinaryCombinations', () => {
	it('numberOfDigits 1', () => {
		const allPossibleStates = getAllPossibleBinaryCombinations(1);
		expect(allPossibleStates).toStrictEqual([[0], [1]]);
	});

	it('numberOfDigits 2', () => {
		const allPossibleStates = getAllPossibleBinaryCombinations(2);
		expect(allPossibleStates).toStrictEqual([
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		]);
	});

	it('numberOfDigits 3', () => {
		const allPossibleStates = getAllPossibleBinaryCombinations(3);
		expect(allPossibleStates).toStrictEqual([
			[0, 0, 0],
			[1, 0, 0],
			[0, 1, 0],
			[1, 1, 0],
			[0, 0, 1],
			[1, 0, 1],
			[0, 1, 1],
			[1, 1, 1]
		]);
	});

	it('numberOfDigits 4', () => {
		const allPossibleStates = getAllPossibleBinaryCombinations(4);
		expect(allPossibleStates).toStrictEqual([
			[0, 0, 0, 0],
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 1, 0],
			[1, 0, 1, 0],
			[0, 1, 1, 0],
			[1, 1, 1, 0],
			[0, 0, 0, 1],
			[1, 0, 0, 1],
			[0, 1, 0, 1],
			[1, 1, 0, 1],
			[0, 0, 1, 1],
			[1, 0, 1, 1],
			[0, 1, 1, 1],
			[1, 1, 1, 1]
		]);
	});
});

describe('base10 to base2', () => {
	it('number 2', () => {
		const binaries = base10toBase2(2);
		expect(binaries).toStrictEqual([0, 1]);
	});

	it('number 10', () => {
		const binaries = base10toBase2(10);
		expect(binaries).toStrictEqual([0, 1, 0, 1]);
	});
});

describe('base2 to base10', () => {
	it('number [0, 1]', () => {
		const num = base2toBase10([0, 1]);
		expect(num).toStrictEqual(2);
	});

	it('number [0, 1, 0, 1]', () => {
		const num = base2toBase10([0, 1, 0, 1]);
		expect(num).toStrictEqual(10);
	});
});
