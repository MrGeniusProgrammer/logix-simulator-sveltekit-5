import { STATE_LOW } from './state';
import { base2toBase10, getAllPossibleBinaryCombinations } from '../helpers/base';
import { Chip } from './chip';

export class StaticChip extends Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputs - the input pins
	 * @param {import("./pin").Pin[]} outputs - the output pins
	 * @param {import("./chip").TruthTable} truthTable
	 */
	constructor(inputs, outputs, truthTable) {
		super(inputs, outputs);

		for (const pin of inputs) {
			pin.connectToBuiltinChip(this);
		}

		/**
		 * @type {import("./chip").TruthTable}
		 */
		this.truthTable = truthTable;
	}

	/**
	 * @returns {import("./pin").UpdatePins}
	 */
	process() {
		/**
		 * @type {number[]}
		 */
		const binaries = new Array(this.inputs.length);

		for (let i = 0; i < this.inputs.length; i++) {
			const pin = this.inputs[i];
			binaries[i] = pin.state;
		}

		const index = base2toBase10(binaries);
		const outputs = this.truthTable[index];

		/**
		 * @type {import("./pin").UpdatePins}
		 */
		const result = new Map();

		for (let i = 0; i < outputs.length; i++) {
			const output = outputs[i];

			let pins = result.get(output);
			if (pins === undefined) {
				pins = [this.outputs[i]];
				result.set(output, pins);
			} else {
				pins.push(this.outputs[i]);
			}
		}

		return result;
	}

	/**
	 * @returns {import("./chip").TruthTable}
	 */
	generateTruthTable() {
		return this.truthTable;
	}
}
