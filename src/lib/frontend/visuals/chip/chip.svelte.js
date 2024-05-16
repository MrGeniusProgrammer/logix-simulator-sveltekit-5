export class VisualChip {
	/**
	 * @type {import("$lib/frontend").Vector2D}
	 */
	pos = $state({ x: 0, y: 0 });

	/**
	 *
	 * @param {import("../../pin.svelte").Pin[]} inputPins[]
	 * @param {import("../../pin.svelte").Pin[]} outputPins[]
	 * @param {import("$lib/frontend").Vector2D} pos
	 * @param {string} name
	 */
	constructor(inputPins, outputPins, name, pos) {
		this.inputPins = inputPins;
		this.outputPins = outputPins;

		this.name = name;
		this.pos = pos;
	}

	/**
	 *
	 * @param {SVGGElement} node
	 * @returns {import("svelte/action").ActionReturn<any, any>}
	 */
	element(node) {
		let diffX = 0;
		let diffY = 0;

		/**
		 *
		 * @param {MouseEvent} e
		 */
		const handleMouseMove = (e) => {
			this.pos.x = e.clientX + diffX;
			this.pos.y = e.clientY + diffY;
		};

		/**
		 *
		 * @param {MouseEvent} e
		 */
		const handleMouseDown = (e) => {
			diffX = this.pos.x - e.clientX;
			diffY = this.pos.y - e.clientY;

			document.addEventListener('mousemove', handleMouseMove);
		};

		document.addEventListener('mouseup', (e) => {
			document.removeEventListener('mousemove', handleMouseMove);
		});

		node.addEventListener('mousedown', handleMouseDown);

		return {
			destroy: () => {
				node.removeEventListener('mousedown', handleMouseDown);
			}
		};
	}
}
