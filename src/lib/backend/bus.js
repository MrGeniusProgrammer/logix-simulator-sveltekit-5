import { STATE_HIGH, STATE_LOW, MAXIMUM_STATES } from './state';

export class Bus {
	/**
	 *
	 * @param {import("./state").State} state - the initial state
	 * @param {import("./pin").Pin[]} inputs - the input pins
	 * @param {import("./pin").Pin[]} outputs - the output pins
	 */
	constructor(state, inputs, outputs) {
		this.state = state;
		this.inputs = inputs;
		this.outputs = outputs;

		// for (const pin of this.inputs) {
		// 	pin.connectToBus(this);
		// }
	}

	/**
	 *
	 * @param {import("./state").State} state
	 * @returns {import("./pin").UpdatePins}
	 */
	update(state) {
		/**
		 * @type {import("./pin").UpdatePins}
		 */
		let result = [];

		if (state === STATE_HIGH && this.state === STATE_LOW) {
			this.state = STATE_HIGH;
			result = [
				{
					state: this.state,
					pins: this.outputs
				}
			];
		} else if (this.inputs.every((v) => v.state === STATE_LOW)) {
			this.state = STATE_LOW;
			result = [
				{
					state: this.state,
					pins: this.outputs
				}
			];
		}

		return result;
	}
}
