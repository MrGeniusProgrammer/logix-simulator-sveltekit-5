/**
 * @typedef UpdatePin
 * @property {import('./state').State} state
 * @property {Array<Pin>} pins
 */

import { STATE_HIGH, STATE_LOW } from './state';

/**
 * @typedef UpdatePins
 * @type {Array<UpdatePin>}
 */

export class Pin {
	/**
	 *
	 * @param {import("./state").State} state - the initial state
	 */
	constructor(state) {
		this.state = state;

		/**
		 * @type {Array<import("./chip").Chip>}
		 */
		this.connectedBuiltinChips = [];

		/**
		 * @type {Array<Pin>}
		 */
		this.influencePins = [];
	}

	/**
	 *
	 * @param {Pin} pin - the pin to link to
	 */
	influencePin(pin) {
		this.influencePins.push(pin);
	}

	/**
	 *
	 * @param {import("./builtin-chip").BuiltinChip} chip - the chip to link to
	 */
	connectToBuiltinChip(chip) {
		this.connectedBuiltinChips.push(chip);
	}

	/**
	 *
	 * @param {import('./state').State} state
	 * @returns {boolean}
	 */
	isUpdatable(state) {
		if (state === STATE_HIGH) {
			if (this.state === STATE_LOW) return true;
			if (this.state === STATE_HIGH) return false;
		}

		return true;
	}

	/**
	 *
	 * @param {import("./state").State} state - the state to change into
	 * @returns {UpdatePins}
	 */
	update(state) {
		// set the new state
		this.state = state;

		/**
		 * @type {UpdatePins}
		 */
		let result = [];

		// check if there any connected pins
		if (this.influencePins.length > 0) {
			// merge the connected pins into the result, because the iternal state got updated that means any connected pins will get updated.

			/**
			 * @type {Pin[]}
			 */
			const pins = [];

			// cache the length
			const length = this.influencePins.length;
			for (let i = 0; i < length; i++) {
				const pin = this.influencePins[i];
				if (!pin.isUpdatable(state)) continue;
				pins.push(pin);
			}

			result = [
				{
					state,
					pins
				}
			];
		}

		// loop over any connected chips
		for (const chip of this.connectedBuiltinChips) {
			// updating pins
			const updatePins = chip.process();

			for (const row of updatePins) {
				result.push(row);
			}
		}

		return result;
	}
}
