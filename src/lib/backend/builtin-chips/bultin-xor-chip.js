import { BuiltinChip } from '../builtin-chip';
import { STATE_LOW, STATE_HIGH } from '../state';

export class BuiltinXOrChip extends BuiltinChip {
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
		const b = this.inputs[1].state;

		const x = !(a || b);
		const y = a && b;
		const o = Number(!(x || y));

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
		return [[STATE_LOW], [STATE_HIGH], [STATE_HIGH], [STATE_HIGH]];
	}
}
