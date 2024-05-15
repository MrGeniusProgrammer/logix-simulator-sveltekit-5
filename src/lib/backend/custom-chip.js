import { Chip } from './chip';
import { MAXIMUM_STATES } from './state';

export class CustomChip extends Chip {
	/**
	 *
	 * @param {import("./pin").Pin[]} inputs - the input pins
	 * @param {import("./pin").Pin[]} outputs - the output pins
	 */
	constructor(inputs, outputs) {
		super(inputs, outputs);
	}

	/**
	 *
	 * @returns {import("./pin").UpdatePins}
	 */
	process() {
		/**
		 * @type {import("./pin").UpdatePins}
		 */
		const result = [];

		for (const pin of this.inputs) {
			result.push({
				state: pin.state,
				pins: [pin]
			});
		}

		return result;
	}
}
