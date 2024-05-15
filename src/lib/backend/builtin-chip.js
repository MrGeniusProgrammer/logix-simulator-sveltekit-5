import { STATE_LOW, STATE_HIGH, MAXIMUM_STATES } from './state';
import { getAllPossibleBinaryCombinations } from '../helpers/base';
import { Chip } from './chip';

export class BuiltinChip extends Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputs - the input pins
	 * @param {import("./pin").Pin[]} outputs - the output pins
	 */
	constructor(inputs, outputs) {
		super(inputs, outputs);

		for (const pin of inputs) {
			pin.connectToBuiltinChip(this);
		}
	}

	/**
	 * @returns {import("./pin").UpdatePins}
	 */
	process() {
		return [];
	}

	/**
	 * @returns {import("./chip").TruthTable}
	 */
	generateTruthTable() {
		/**
		 * @type {import("./chip").TruthTable}
		 */
		const result = [];

		const allPossibleCombinations = getAllPossibleBinaryCombinations(this.inputs.length);
		for (const combinations of allPossibleCombinations) {
			for (let i = 0; i < combinations.length; i++) {
				const state = combinations[i];
				this.inputs[i].update(state);
			}

			const updatePins = this.process();

			/**
			 * @type {import('./state').State[]}
			 */
			const possibleOutput = new Array(this.outputs.length).fill(STATE_LOW);

			for (let i = 0; i < updatePins.length; i++) {
				const { state, pins } = updatePins[i];

				for (const pin of pins) {
					const index = this.outputs.indexOf(pin);
					possibleOutput[index] = state;
				}
			}

			result.push(possibleOutput);
		}

		return result;
	}
}
