/**
 * @typedef ChipType
 * @type {'and' | 'or' | 'not' | 'nor' | 'nand' | 'xor' | 'xand' | "custom"}
 */

/**
 * @template T
 */
export class Adapter {
	/**
	 *
	 * @returns {T | undefined}
	 */
	onCreatePin() {
		return undefined;
	}

	/**
	 *
	 * @param {T} startId
	 * @param {T} endId
	 * @returns {boolean}
	 */
	onAddEdge(startId, endId) {
		return false;
	}

	/**
	 * @param {T[]} inputPinIds
	 * @param {T[]} outputPinIds
	 * @param {ChipType} type
	 * @returns {boolean}
	 */
	onCreateChip(inputPinIds, outputPinIds, type) {
		return false;
	}

	/**
	 * @param {T} id
	 * @returns {import("./state").State | undefined}
	 */
	getState(id) {
		return undefined;
	}

	/**
	 *
	 * @param {T} id
	 * @param {import("./state").State} state
	 * @returns {boolean}
	 */
	updateState(id, state) {
		return false;
	}

	run() {}
}
