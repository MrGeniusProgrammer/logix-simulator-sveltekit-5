import { bench, test } from 'vitest';
import { describe } from 'vitest';
import { runComponents, Component } from './anda';
import { STATE_LOW, STATE_HIGH } from './const';
import { expect } from 'vitest';
import { it } from 'vitest';

describe('backend 2 test', () => {
	/**
	 * @type {Component[]}
	 */
	let components = [];
	let componentsOutputs = [];

	const out1 = new Component();
	const out2 = new Component();
	const out3 = new Component();
	const out4 = new Component();
	const not0 = new Component([[[0, 0]]], ([a]) => [Number(!a)]);
	const not1 = new Component([[[2, 0]]], ([a]) => [Number(!a)]);
	const and0 = new Component([[[4, 0]], [[1, 0]]], ([a, b]) => [a && b]);
	const or0 = new Component([[[5, 0]], [[3, 0]]], ([a, b]) => [a || b]);
	const or1 = new Component([[[7, 0]], [[8, 0]]], ([a, b]) => [a || b]);

	components.push(out1, out2, out3, out4, not0, not1, or1, and0, or0);

	it('circuit 1', () => {
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

		// const start = performance.now();
		runComponents(components, componentsOutputs);
		// const end = performance.now();
		// console.log(end - start);
		console.log(componentsOutputs);
		expect(componentsOutputs[6][0]).toEqual(1);
	});

	it('circuit 2', () => {
		/**
		 * @type {Component[]}
		 */
		let components = [];

		let componentsOutputs = [];

		const outer1 = new Component([], () => [1]);
		const outer2 = new Component();
		const not = new Component([[[1, 0]]], ([a]) => [Number(!a)]);
		const and = new Component([[[0, 0]], [[2, 0]]], ([a, b]) => [a && b]);
		components.push(outer1, outer2, not, and);

		// const start = performance.now();
		runComponents(components, componentsOutputs);
		// const end = performance.now();
		// console.log(end - start);
		console.log(componentsOutputs);
	});

	it('circuit 3', () => {
		/**
		 * @type {Component[]}
		 */
		let components = [];
		let componentsOutputs = [];

		/**
		 * p0
		 *    \
		 *      p2 - not1 - p3
		 *    /
		 * p1
		 */
		const outer1 = new Component();
		const outer2 = new Component();
		const not = new Component(
			[
				[
					[0, 0],
					[2, 0]
				]
			],
			([a]) => [Number(!a)]
		);
		components.push(outer1, not, outer2);
		runComponents(components, componentsOutputs);
		console.log(componentsOutputs);
		expect(componentsOutputs[1]).toEqual([1]);
	});

	it('circuit 4', () => {
		/**
		 * @type {Component[]}
		 */
		let components = [];
		let componentsOutputs = [];

		const o0 = new Component([], () => [1]);
		const o1 = new Component([], () => [1]);
		const o2 = new Component([], () => [1]);

		const dff = new Component([[[0, 0]], [[1, 0]], [[2, 0]]], (inputs) => {
			// inputs [1, 1, 1]
			// componentout [[1], [1], [1]]

			const componentOutputs = [];
			let components = [];

			for (let i = 0; i < inputs.length; i++) {
				const input = inputs[i];
				components.push(new Component([], () => [input]));
			}

			// and input index [0, 0] and [0, 1]
			const and0 = new Component([[[0, 0]], [[1, 0]]], ([a, b]) => [a && b]);
			// const and0 = new Component([[[0, 0]], [[0, 1]]], ([a, b]) => [a && b]);

			// and input index [0, 2] and [1, 0]
			const and1 = new Component([[[2, 0]], [[3, 0]]], ([a, b]) => [a && b]);
			// const and1 = new Component([[[0, 2]], [[1, 0]]], ([a, b]) => [a && b]);

			components.push(and0, and1);

			runComponents(components, componentOutputs);

			return componentOutputs[componentOutputs.length - 1];
		});

		components.push(o0, o1, o2, dff);
		runComponents(components, componentsOutputs);
		console.log(componentsOutputs);
	});
});
