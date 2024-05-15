import { BuiltinChip } from '../builtin-chip';
import { STATE_LOW, STATE_HIGH, MAXIMUM_STATES } from '../state';

export class BuiltinNotChip extends BuiltinChip {
	/**
	 *
	 * @param {import("../pin").Pin[]} inputs - the input pins
	 * @param {import("../pin").Pin[]} outputs - the output pins
	 */
	constructor(inputs, outputs) {
		super(inputs, outputs);
	}

	/**
	 *
	 * @returns {import("../pin").UpdatePins}
	 */
	process() {
		const a = this.inputs[0].state;
		const o = Number(!a);

		/**
		 * @type {import("../pin").UpdatePins}
		 */
		let result = [];

		if (this.outputs[0].isUpdatable(o)) {
			result = [
				{
					state: o,
					pins: this.outputs
				}
			];
		}

		return result;
	}

	/**
	 * @returns {import("../chip").TruthTable}
	 */
	static generateTruthTable() {
		return [[STATE_HIGH], [STATE_LOW]];
	}
}
