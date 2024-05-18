import { STATE_LOW } from './state';

/**
 * @template T
 */
export class Pin {
	/**
	 *
	 * @param {import("./state").State} state
	 * @param {string} name
	 * @param {T} id
	 */
	constructor(state, name, id) {
		this.state = state;
		this.name = name;
		this.id = id;
	}
}
