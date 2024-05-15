/**
 *
 * @param {number} num
 * @returns {number[]}
 */
export function base10toBase2(num) {
	let result = [];

	const largestPower = ~~(Math.log(num) / Math.log(2));
	for (let pow = largestPower; pow >= 0; pow--) {
		const digit = ~~(num / 2 ** pow);
		num -= digit * 2 ** pow;
		result.unshift(digit);
	}

	return result;
}

/**
 *
 * @param {number[]} num
 * @returns {number}
 */
export function base2toBase10(num) {
	let result = 0;

	for (let i = 0; i < num.length; i++) {
		const binary = num[i];
		result += binary * 2 ** i;
	}

	return result;
}

/**
 *
 * @param {number} numberOfDigits
 * @returns {number[][]}
 */
export function getAllPossibleBinaryCombinations(numberOfDigits) {
	const numberOfPossibleCombinations = Math.pow(2, numberOfDigits);

	/**
	 * @type {number[][]}
	 */
	const allPossibleBinaryCombinations = new Array(numberOfPossibleCombinations);

	for (let i = 0; i < numberOfPossibleCombinations; i++) {
		let result = base10toBase2(i);
		if (result.length < numberOfDigits) {
			result = result.concat(new Array(numberOfDigits - result.length).fill(0));
		}

		allPossibleBinaryCombinations[i] = result;
	}

	return allPossibleBinaryCombinations;
}
