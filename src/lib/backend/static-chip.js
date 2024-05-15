import { STATE_LOW } from './state';
import { base2toBase10, getAllPossibleBinaryCombinations } from '../helpers/base';
import { Chip } from './chip';
import { STATE_HIGH } from '$lib/const';

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
		let result = [];

		/**
		 * @type {import("./pin").Pin[]}
		 */
		const stateLowPins = [];

		/**
		 * @type {import("./pin").Pin[]}
		 */
		const stateHighPins = [];

		for (let i = 0; i < outputs.length; i++) {
			const output = outputs[i];

			if (output === STATE_LOW) {
				stateLowPins.push(this.outputs[i]);
			} else if (output === STATE_HIGH) {
				stateHighPins.push(this.outputs[i]);
			}
		}

		result = [
			{
				state: STATE_LOW,
				pins: stateLowPins
			},
			{
				state: STATE_HIGH,
				pins: stateLowPins
			}
		];

		return result;
	}

	/**
	 * @returns {import("./chip").TruthTable}
	 */
	generateTruthTable() {
		return this.truthTable;
	}
}
