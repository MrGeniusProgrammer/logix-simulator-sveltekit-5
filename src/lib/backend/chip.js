/**
 * @typedef TruthTable
 * @type {import("./state").State[][]}
 */

export class Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputs - the input pins
	 * @param {import("./pin").Pin[]} outputs - the output pins
	 */
	constructor(inputs, outputs) {
		this.inputs = inputs;
		this.outputs = outputs;

		this.priority = 0;
	}

	/**
	 * @returns {import("./pin").UpdatePins}
	 */
	process() {
		return [];
	}

	/**
	 * @returns {TruthTable}
	 */
	generateTruthTable() {
		return [];
	}
}
