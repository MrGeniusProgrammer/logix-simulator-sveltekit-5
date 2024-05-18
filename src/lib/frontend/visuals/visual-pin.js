import { STATE_HIGH } from '../state';
import { DEFAULT_PIN_RADIUS } from '../const';

/**
 * @template T
 */
export class VisualPin {
	/**
	 *
	 * @param {import("../pin").Pin<T>} pin
	 * @param {import("../").Vector2D} pos
	 */
	constructor(pin, pos = { x: 0, y: 0 }) {
		this.pin = pin;
		this.pos = pos;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		ctx.save();
		if (this.pin.state === STATE_HIGH) {
			ctx.fillStyle = 'red';
		} else {
			ctx.fillStyle = 'grey';
		}

		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, DEFAULT_PIN_RADIUS, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
}
