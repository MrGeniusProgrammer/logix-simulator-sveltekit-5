import { describe } from 'vitest';
import { runComponents, Component } from './anda1';
import { STATE_LOW, STATE_HIGH } from './const';
import {
	BuiltinAndChip,
	BuiltinNotChip,
	BuiltinOrChip,
	Pin,
	CustomChip,
	Simulator,
	Bus,
	StaticChip,
	STATE_HIGH as BACKEND_STATE_HIGH,
	STATE_LOW as BACKEND_STATE_LOW
} from './backend';
import { describe, expect, bench } from 'vitest';

describe('bench', () => {
	const p0 = new Pin(BACKEND_STATE_LOW);
	const p2 = new Pin(BACKEND_STATE_LOW);
	const p4 = new Pin(BACKEND_STATE_LOW);
	const p5 = new Pin(BACKEND_STATE_LOW);
	const p6 = new Pin(BACKEND_STATE_LOW);
	const p7 = new Pin(BACKEND_STATE_LOW);
	const p8 = new Pin(BACKEND_STATE_LOW);
	const p9 = new Pin(BACKEND_STATE_LOW);
	const p10 = new Pin(BACKEND_STATE_LOW);

	new BuiltinNotChip([p0], [p4]);
	new BuiltinAndChip([p4, p5], [p8]);
	new BuiltinNotChip([p2], [p6]);
	new BuiltinOrChip([p6, p7], [p9]);
	new BuiltinOrChip([p8, p9], [p10]);
	const customChip = new CustomChip([p0, p5, p2, p7], [p10]);

	const simulator = new Simulator(100);

	bench.only('backend 1 circuit 1', () => {
		/**
		 * circuit 1
		 * p0 - not0 - p4
		 *               \
		 *                and0 - p8
		 *               /         \
		 *             p5           \
		 *                           or1 - p10
		 * p2 - not1 - p6           /
		 *               \         /
		 *                or0 - p9
		 *               /
		 *             p7
		 */

		simulator.runChip(customChip);
	});

	bench('backend 1 circuit 2', () => {
		/**
		 * circuit 2
		 * p0 - not0 - p1 - not1 - p3
		 *            /
		 *          p2
		 */

		const p0 = new Pin(BACKEND_STATE_LOW);
		const p1 = new Pin(BACKEND_STATE_LOW);
		const p2 = new Pin(BACKEND_STATE_LOW);
		const p3 = new Pin(BACKEND_STATE_LOW);

		p2.influencePin(p1);

		const not0 = new BuiltinNotChip([p0], [p1]);
		const not1 = new BuiltinNotChip([p3], [p3]);
		const customChip = new CustomChip([p0, p2], [p3]);

		const simulator = new Simulator(1);
		simulator.runChip(customChip);
	});

	bench('backend 1 circuit 3', () => {
		/**
		 * circuit 3
		 *    p0 - not - p2
		 *   /
		 * p1
		 */

		const p0 = new Pin(BACKEND_STATE_LOW);
		const p1 = new Pin(BACKEND_STATE_LOW);
		const p2 = new Pin(BACKEND_STATE_LOW);

		p1.influencePin(p0);

		const not = new BuiltinNotChip([p0], [p2]);
		const customChip = new CustomChip([p0, p1], [p2]);

		const simulator = new Simulator(1);
		simulator.runChip(customChip);
	});

	/**
	 * @type {Component[]}
	 */
	let components = [];
	let componentsOutputs = [];

	const out1 = new Component();
	const out2 = new Component();
	const out3 = new Component();
	const out4 = new Component();
	const not0 = new Component([[{ componentIndex: 0, inputIndex: 0 }]], ([a]) => [Number(!a)]);
	const not1 = new Component([[{ componentIndex: 2, inputIndex: 0 }]], ([a]) => [Number(!a)]);
	const and0 = new Component(
		[[{ componentIndex: 4, inputIndex: 0 }], [{ componentIndex: 1, inputIndex: 0 }]],
		([a, b]) => [a && b]
	);
	const or0 = new Component(
		[[{ componentIndex: 5, inputIndex: 0 }], [{ componentIndex: 3, inputIndex: 0 }]],
		([a, b]) => [a || b]
	);
	const or1 = new Component(
		[[{ componentIndex: 6, inputIndex: 0 }], [{ componentIndex: 7, inputIndex: 0 }]],
		([a, b]) => [a || b]
	);

	components.push(out1, out2, out3, out4, not0, not1, and0, or0, or1);

	bench.only('backend 2 circuit 1', () => {
		/**
		 * circuit 1
		 * p0 - not0 - p4
		 *               \
		 *                and0 - p8
		 *               /         \
		 * p1 -------- p5           \
		 *                           or1 - p10
		 * p2 - not1 - p6           /
		 *               \         /
		 *                or0 - p9
		 *               /
		 * p3 ------- p7
		 *
		 *
		 */

		runComponents(components, componentsOutputs);
	});

	bench('backend 2 circuit 2', () => {
		/**
		 * circuit 2
		 * p0 - not0 - p1
		 *               \
		 *                 p3 - not1 - p4
		 *               /
		 *            p2
		 */

		/**
		 * @type {Component[]}
		 */
		let components = [];
		let componentsOutputs = [];

		const outer1 = new Component();
		const outer2 = new Component();
		const not0 = new Component([[{ componentIndex: 0, inputIndex: 0 }]], ([a]) => [Number(!a)]);
		const not1 = new Component(
			[
				[
					{ componentIndex: 1, inputIndex: 0 },
					{ componentIndex: 2, inputIndex: 0 }
				]
			],
			([a]) => [Number(!a)]
		);

		components.push(outer1, not0, outer2, not1);
		runComponents(components, componentsOutputs);
		// console.log(componentsOutputs);
	});

	bench('backend 2 circuit 3', () => {
		/**
		 * circuit 3
		 *    p0 - not - p2
		 *   /
		 * p1
		 */

		/**
		 * @type {Component[]}
		 */
		let components = [];
		let componentsOutputs = [];

		const outer1 = new Component();
		const outer2 = new Component();
		const not = new Component(
			[
				[
					{ componentIndex: 0, inputIndex: 0 },
					{ componentIndex: 2, inputIndex: 0 }
				]
			],
			([a]) => [Number(!a)]
		);
		components.push(outer1, not, outer2);
		runComponents(components, componentsOutputs);
	});
});
