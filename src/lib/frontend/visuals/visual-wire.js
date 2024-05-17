import { DEFAULT_WIRE_THICKNESS } from '../const';
import { STATE_HIGH } from '../state';

/**
 * @template T
 */
export class VisualWire {
	/**
	 *
	 * @param {import("./visual-pin").VisualPin<T>} startPin
	 * @param {import("../").Vector2D} end
	 */
	constructor(startPin, end) {
		/**
		 * @type {import("../").Vector2D[]}
		 */
		this.points = [startPin.pos, end];
		this.radius = 7;
		this.startPin = startPin;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		ctx.save();
		ctx.lineWidth = DEFAULT_WIRE_THICKNESS;

		if (this.startPin.pin.state === STATE_HIGH) {
			ctx.strokeStyle = 'red';
		} else {
			ctx.strokeStyle = 'grey';
		}

		const path = new Path2D();

		path.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 1; i < this.points.length - 1; i++) {
			const prev = this.points[i - 1];
			const curr = this.points[i];
			const next = this.points[i + 1];

			/**
			 * @type {import("../").Vector2D}
			 */
			const prevDiff = {
				x: prev.x - curr.x,
				y: prev.y - curr.y
			};

			/**
			 * @type {import("../").Vector2D}
			 */
			const prevMiddle = {
				x: (prev.x + curr.x) / 2,
				y: (prev.y + curr.y) / 2
			};

			const prevDiffLength = Math.sqrt(prevDiff.x * prevDiff.x + prevDiff.y * prevDiff.y);

			prevDiff.x = (prevDiff.x / prevDiffLength) * this.radius;
			prevDiff.y = (prevDiff.y / prevDiffLength) * this.radius;

			/**
			 * @type {import("../").Vector2D}
			 */
			const nextDiff = {
				x: next.x - curr.x,
				y: next.y - curr.y
			};

			/**
			 * @type {import("../").Vector2D}
			 */
			const nextMiddle = {
				x: (next.x + curr.x) / 2,
				y: (next.y + curr.y) / 2
			};

			const nextDiffLength = Math.sqrt(nextDiff.x * nextDiff.x + nextDiff.y * nextDiff.y);
			nextDiff.x = (nextDiff.x / nextDiffLength) * this.radius;
			nextDiff.y = (nextDiff.y / nextDiffLength) * this.radius;

			/**
			 * @type {import("../").Vector2D}
			 */
			const start = {
				x: curr.x + prevDiff.x,
				y: curr.y + prevDiff.y
			};

			start.x = prevDiff.x > 0 ? Math.min(start.x, prevMiddle.x) : Math.max(start.x, prevMiddle.x);
			start.y = prevDiff.y > 0 ? Math.min(start.y, prevMiddle.y) : Math.max(start.y, prevMiddle.y);

			path.lineTo(start.x, start.y);

			/**
			 * @type {import("../").Vector2D}
			 */
			const end = {
				x: curr.x + nextDiff.x,
				y: curr.y + nextDiff.y
			};

			end.x = nextDiff.x > 0 ? Math.min(end.x, nextMiddle.x) : Math.max(end.x, nextMiddle.x);
			end.y = nextDiff.y > 0 ? Math.min(end.y, nextMiddle.y) : Math.max(end.y, nextMiddle.y);

			path.bezierCurveTo(start.x, start.y, end.x, end.y, curr.x, curr.y);
		}

		const lastPoint = this.points[this.points.length - 1];
		path.lineTo(lastPoint.x, lastPoint.y);
		ctx.stroke(path);
		ctx.restore();
	}
}
