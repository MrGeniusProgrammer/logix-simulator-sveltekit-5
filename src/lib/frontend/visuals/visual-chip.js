import {
	DEFAULT_CIRCUIT_PADDING_X,
	DEFAULT_CIRCUIT_PINS_GAP,
	DEFAULT_PIN_DIAMETER,
	DEFAULT_PIN_RADIUS
} from '../const';

/**
 * @template T
 */
export class VisualChip {
	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {import("./visual-pin").VisualPin<T>[]} inputPins - the input pins this circuit has
	 * @param {import("./visual-pin").VisualPin<T>[]} outputPins - the output pins this circuit has
	 * @param {import("../").Vector2D} pos - the circuit position
	 * @param {string} name - the name of the circuit like 'and', 'or', and etc.
	 */
	constructor(ctx, inputPins, outputPins, pos, name) {
		this.outputPins = outputPins;
		this.inputPins = inputPins;
		this.name = name;
		this.pos = pos;

		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const metrics = ctx.measureText(this.name);

		this.width = DEFAULT_CIRCUIT_PADDING_X * 2 + metrics.width;

		const maxNumberOfPins = Math.max(outputPins.length, inputPins.length);
		this.height =
			DEFAULT_CIRCUIT_PINS_GAP * (maxNumberOfPins + 1) + maxNumberOfPins * DEFAULT_PIN_DIAMETER;

		this.inputListOffset =
			(this.height -
				(DEFAULT_CIRCUIT_PINS_GAP * (inputPins.length - 1) +
					inputPins.length * DEFAULT_PIN_DIAMETER)) /
				2 +
			DEFAULT_PIN_RADIUS;

		this.outputListOffset =
			(this.height -
				(DEFAULT_CIRCUIT_PINS_GAP * (outputPins.length - 1) +
					outputPins.length * DEFAULT_PIN_DIAMETER)) /
				2 +
			DEFAULT_PIN_RADIUS;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = 'hsl(0deg 0% 20.07%)';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		ctx.restore();

		ctx.save();
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'white';
		ctx.fillText(this.name, this.pos.x + this.width / 2, this.pos.y + this.height / 2);
		ctx.restore();

		let offset = this.inputListOffset;
		for (const pin of this.inputPins) {
			pin.pos.x = this.pos.x;
			pin.pos.y = this.pos.y + offset;
			pin.draw(ctx);
			offset += DEFAULT_CIRCUIT_PINS_GAP + DEFAULT_PIN_DIAMETER;
		}

		offset = this.outputListOffset;
		for (const pin of this.outputPins) {
			pin.pos.y = this.pos.y + offset;
			pin.pos.x = this.pos.x + this.width;
			offset += DEFAULT_CIRCUIT_PINS_GAP + DEFAULT_PIN_DIAMETER;
			pin.draw(ctx);
		}
	}
}
