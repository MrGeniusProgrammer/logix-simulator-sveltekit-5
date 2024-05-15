/**
 * @typedef UpdatePin
 * @property {import('./state').State} state
 * @property {IterableIterator<Pin>} pins
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

		/**
		 * @type {Map<Pin, boolean>}
		 */
		this.dependentPins = new Map();
	}

	/**
	 *
	 * @param {Pin} pin - the pin to link to
	 */
	influencePin(pin) {
		this.influencePins.push(pin);
		pin.dependentPins.set(this, false);
	}

	/**
	 *
	 * @param {Pin} pin - the pin to link to
	 */
	dependPin(pin) {
		this.dependentPins.set(pin, false);
		pin.influencePins.push(this);
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
	 * @param {Pin} pin
	 * @returns {boolean}
	 */
	isUpdatable(pin) {
		this.dependentPins.set(pin, true);

		if (pin.state === STATE_HIGH && this.state === STATE_LOW) {
			return true;
		}

		let iterator = this.dependentPins.entries();
		for (const [pin, isVisited] of iterator) {
			if (!isVisited || pin.state === STATE_HIGH) return false;
		}

		if (this.state === STATE_HIGH) {
			return true;
		}

		return false;
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
				if (!pin.isUpdatable(this)) continue;
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
			chip.priority++;

			if (chip.priority >= chip.inputs.length) {
				// updating pins
				const updatePins = chip.process();

				for (const row of updatePins) {
					result.push(row);
				}
			}
		}

		return result;
	}
}
