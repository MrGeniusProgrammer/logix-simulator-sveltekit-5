/**
 * @typedef Vector2D
 * @property {number} x
 * @property {number} y
 */

import { STATE_HIGH } from './state';

export class VisualPin {
	/**
	 *
	 * @param {import("./pin.svelte").Pin} pin
	 * @param {Vector2D} pos
	 */
	constructor(pin, pos) {
		this.pin = pin;
		this.pos = $state(pos);
	}

	handleDrag() {
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

		this.element.addEventListener('mousedown', (e) => {
			const rect = this.element.getBoundingClientRect();
			diffX = rect.x - e.clientX;
			diffY = rect.y - e.clientY;

			this.rootElement.addEventListener('mousemove', handleMouseMove);
		});

		this.rootElement.addEventListener('mouseup', (e) => {
			this.rootElement.removeEventListener('mousemove', handleMouseMove);
		});
	}
}

export class VisualChip {
	/**
	 *
	 * @param {HTMLElement} rootElement
	 * @param {import("./pin").Pin[]} inputPins[]
	 * @param {import("./pin").Pin[]} outputPins[]
	 * @param {string} name
	 * @param {Vector2D} pos
	 */
	constructor(rootElement, inputPins, outputPins, name, pos) {
		this.inputPins = inputPins;
		this.outputPins = outputPins;
		this.rootElement = rootElement;

		this.element = document.createElement('div');
		this.element.setAttribute('class', 'chip');
		this.element.style.left = `${pos.x}px`;
		this.element.style.top = `${pos.y}px`;

		const inputList = document.createElement('div');

		for (const pin of inputPins) {
			const visualPin = new VisualPin(rootElement, pin);
			inputList.appendChild(visualPin.element);
		}

		this.element.appendChild(inputList);

		const span = document.createElement('span');
		span.setAttribute('class', 'chip-name');
		span.innerText = name;
		this.element.appendChild(span);

		const outputList = document.createElement('div');

		for (const pin of outputPins) {
			const visualPin = new VisualPin(rootElement, pin);
			outputList.appendChild(visualPin.element);
		}

		this.element.appendChild(outputList);
	}

	handleDrag() {
		let diffX = 0;
		let diffY = 0;

		/**
		 *
		 * @param {MouseEvent} e
		 */
		const handleMouseMove = (e) => {
			this.element.style.left = `${e.clientX + diffX}px`;
			this.element.style.top = `${e.clientY + diffY}px`;
		};

		this.element.addEventListener('mousedown', (e) => {
			this.element.style.userSelect = 'none';
			const rect = this.element.getBoundingClientRect();
			diffX = rect.x - e.clientX;
			diffY = rect.y - e.clientY;

			this.rootElement.addEventListener('mousemove', handleMouseMove);
		});

		this.rootElement.addEventListener('mouseup', (e) => {
			this.rootElement.removeEventListener('mousemove', handleMouseMove);
		});
	}
}
export class VisualWire {
	/**
	 *
	 * @param {HTMLElement} rootElement
	 * @param {VisualPin} startPin
	 * @param {VisualPin} endPin
	 */

	constructor(rootElement, startPin, endPin) {
		this.points = [startPin.pos, endPin.pos];
		this.state = state;
		this.rootElement = rootElement;
		this.startPin = startPin;
		this.endPin = endPin;
		this.wirePending = false;
	}

	handleWireMove() {
		const handleMouseMove = (e) => {};
	}
}
