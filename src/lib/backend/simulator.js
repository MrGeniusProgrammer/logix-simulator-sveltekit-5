import { MAXIMUM_STATES } from './state';

export class Simulator {
	/**
	 *
	 * @param {number} iteration
	 */
	constructor(iteration) {
		this.maximumIteration = iteration;
		this.currentIteration = 0;

		/**
		 * internal update pins
		 * @type {import("./pin").UpdatePins}
		 */
		this.updatePins = [];
	}

	/**
	 *
	 * @param {import("./chip").Chip} chip
	 */
	runChip(chip) {
		return this.runUpdatePins(chip.process());
	}

	/**
	 *
	 * @param {import("./pin").UpdatePins} updatePins
	 */
	runUpdatePins(updatePins) {
		// merge the incoming updating pins with the internal updating pins
		this.updatePins = this.updatePins.concat(updatePins);

		while (this.updatePins.length > 0 && this.currentIteration !== this.maximumIteration) {
			// pop the updating pins until there is no more updating pins left in root state

			/**
			 * @type {import('./pin').UpdatePin}
			 */
			const popped = this.updatePins.pop();

			for (const pin of popped.pins) {
				// merging with the pin update pins
				this.updatePins = this.updatePins.concat(pin.update(popped.state));
			}

			this.currentIteration++;
		}

		this.currentIteration = 0;

		// // reset the current iteration
		// this.currentIteration = 0;
	}
}
