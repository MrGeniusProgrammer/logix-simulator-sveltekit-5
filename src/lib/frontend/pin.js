export class Pin {
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
