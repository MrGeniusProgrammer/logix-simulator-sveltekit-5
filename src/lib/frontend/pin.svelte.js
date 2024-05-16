import { STATE_LOW } from './state';

export class Pin {
	/**
	 * @type {import("$lib/frontend").State}
	 */
	state = $state(STATE_LOW);

	/**
	 * @type {string}
	 */
	name = $state('');

	/**
	 *
	 * @param {import("./state").State} state
	 * @param {string} name
	 * @param {number} id
	 */
	constructor(state, name, id) {
		this.state = state;
		this.name = name;
		this.id = id;
	}
}
