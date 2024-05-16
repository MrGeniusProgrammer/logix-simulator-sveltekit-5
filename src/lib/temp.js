import { STATE_HIGH, STATE_LOW } from './const';

/**
 * @typedef Vector2D
 * @property {number} x
 * @property {number} y
 */

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

window.onresize = (e) => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

const DEFAULT_PIN_RADIUS = 10;
const DEFAULT_PIN_DIAMETER = DEFAULT_PIN_RADIUS * 2;
const DEFAULT_CIRCUIT_PADDING_X = 25;
const DEFAULT_CIRCUIT_PINS_GAP = 7;

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} state
 * @param {Vector2D} pos - the pin position
 */
function drawPin(ctx, state, pos) {
	ctx.save();
	if (state === STATE_HIGH) {
		ctx.fillStyle = 'red';
	} else {
		ctx.fillStyle = 'hsl(0deg 0% 10%)';
	}

	ctx.beginPath();
	ctx.arc(pos.x, pos.y, DEFAULT_PIN_RADIUS, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} radius
 * @param {Vector2D[]} points
 */
function drawLinkedLine(ctx, radius, points) {}

class BaseVisual {
	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {}
}

class VisualPin extends BaseVisual {
	/**
	 *
	 * @param {number} state
	 * @param {Vector2D} pos
	 */
	constructor(state, pos = { x: 0, y: 0 }) {
		super();
		this.state = state;
		this.pos = pos;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		drawPin(ctx, this.state, this.pos);
	}
}

class VisualCircuit extends BaseVisual {
	/**
	 *
	 * @param {VisualPin[]} inputPins - the input pins this circuit has
	 * @param {VisualPin[]} outputPins - the output pins this circuit has
	 * @param {Vector2D} pos - the circuit position
	 * @param {string} name - the name of the circuit like 'and', 'or', and etc.
	 */
	constructor(inputPins, outputPins, pos, name) {
		super();
		this.outputPins = outputPins;
		this.inputPins = inputPins;
		this.name = name;
		this.pos = pos;

		const maxNumberOfPins = Math.max(outputPins.length, inputPins.length);

		ctx.save();
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const metrics = ctx.measureText(this.name);
		ctx.restore();

		this.width = DEFAULT_CIRCUIT_PADDING_X * 2 + metrics.width;
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
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		ctx.fillStyle = 'hsl(0deg 0% 20.07%)';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		ctx.fillStyle = 'white';
		ctx.fillText(this.name, this.pos.x + this.width / 2, this.pos.y + this.height / 2);

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

class VisualWire extends BaseVisual {
	/**
	 *
	 * @param {Vector2D} start
	 * @param {number} state
	 * @param {Vector2D} end
	 */
	constructor(start, state, end) {
		super();

		/**
		 * @type {Vector2D[]}
		 */
		this.points = [start, end];
		this.state = state;
		this.radius = 7;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 1; i < this.points.length - 1; i++) {
			const prev = this.points[i - 1];
			const curr = this.points[i];
			const next = this.points[i + 1];

			/**
			 * @type {Vector2D}
			 */
			const prevDiff = {
				x: prev.x - curr.x,
				y: prev.y - curr.y
			};

			/**
			 * @type {Vector2D}
			 */
			const prevMiddle = {
				x: (prev.x + curr.x) / 2,
				y: (prev.y + curr.y) / 2
			};

			const prevDiffLength = Math.sqrt(prevDiff.x * prevDiff.x + prevDiff.y * prevDiff.y);

			prevDiff.x = (prevDiff.x / prevDiffLength) * this.radius;
			prevDiff.y = (prevDiff.y / prevDiffLength) * this.radius;

			/**
			 * @type {Vector2D}
			 */
			const nextDiff = {
				x: next.x - curr.x,
				y: next.y - curr.y
			};

			/**
			 * @type {Vector2D}
			 */
			const nextMiddle = {
				x: (next.x + curr.x) / 2,
				y: (next.y + curr.y) / 2
			};

			const nextDiffLength = Math.sqrt(nextDiff.x * nextDiff.x + nextDiff.y * nextDiff.y);
			nextDiff.x = (nextDiff.x / nextDiffLength) * this.radius;
			nextDiff.y = (nextDiff.y / nextDiffLength) * this.radius;

			/**
			 * @type {Vector2D}
			 */
			const start = {
				x: curr.x + prevDiff.x,
				y: curr.y + prevDiff.y
			};

			start.x = prevDiff.x > 0 ? Math.min(start.x, prevMiddle.x) : Math.max(start.x, prevMiddle.x);
			start.y = prevDiff.y > 0 ? Math.min(start.y, prevMiddle.y) : Math.max(start.y, prevMiddle.y);

			ctx.lineTo(start.x, start.y);

			/**
			 * @type {Vector2D}
			 */
			const end = {
				x: curr.x + nextDiff.x,
				y: curr.y + nextDiff.y
			};

			end.x = nextDiff.x > 0 ? Math.min(end.x, nextMiddle.x) : Math.max(end.x, nextMiddle.x);
			end.y = nextDiff.y > 0 ? Math.min(end.y, nextMiddle.y) : Math.max(end.y, nextMiddle.y);

			ctx.quadraticCurveTo(curr.x, curr.y, end.x, end.y);
		}

		const lastPoint = this.points[this.points.length - 1];
		ctx.lineTo(lastPoint.x, lastPoint.y);
		ctx.stroke();
	}
}

/**
 * @type {VisualPin[]}
 */
const pins = [];

pins.push(
	new VisualPin(STATE_LOW, { x: 20, y: 200 }),
	new VisualPin(STATE_LOW),
	new VisualPin(STATE_HIGH),
	new VisualPin(STATE_HIGH),
	new VisualPin(STATE_LOW)
);

const pin = pins[0];
const circuit = new VisualCircuit(
	[pins[1], pins[2], pins[3]],
	[pins[4]],
	{
		x: 150,
		y: 150
	},
	'and'
);

const wire = new VisualWire(pin.pos, 0, circuit.inputPins[0].pos);

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'hsl(0deg 0% 30.07%)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	wire.draw(ctx);

	pin.draw(ctx);
	circuit.draw(ctx);

	requestAnimationFrame(draw);
}

/**
 *
 * @param {MouseEvent} e
 */
function handleMouseDown(e) {
	for (const pin of pins) {
		/**
		 * @type {Vector2D}
		 */
		const diff = {
			x: pin.pos.x - e.clientX,
			y: pin.pos.y - e.clientY
		};

		const length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

		if (length <= DEFAULT_PIN_RADIUS) {
			pin.state = pin.state === STATE_HIGH ? STATE_LOW : STATE_HIGH;
		}
	}
}

/**
 *
 * @param {MouseEvent} e
 */
function handleMouseMove(e) {}

/**
 *
 * @param {MouseEvent} e
 */
function handleMouseUp(e) {}

document.onmousedown = (e) => {
	e.preventDefault();
	handleMouseDown(e);

	document.onmousemove = (e) => {
		e.preventDefault();
		handleMouseMove(e);
	};
};

document.onmouseup = (e) => {
	e.preventDefault();
	handleMouseUp(e);

	document.onmousemove = undefined;
};

draw();
