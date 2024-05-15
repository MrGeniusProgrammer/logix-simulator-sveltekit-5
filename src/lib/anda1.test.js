import { describe } from 'vitest';
import { runComponents, Component } from './anda1';
import { describe } from 'vitest';
import { it } from 'vitest';

describe.skip('bench', () => {
	it('backend 2 circuit 3', () => {
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
					{ componentIndex: 0, inputIndex: 0 },
					{ componentIndex: 2, inputIndex: 0 }
				]
			],
			([a]) => [Number(!a)]
		);
		components.push(outer1, not, outer2);
		runComponents(components, componentsOutputs);
		console.log(componentsOutputs);
	});

	it('backend 2 circuit 4', () => {
		/**
		 * @type {Component[]}
		 */
		let components = [];
		let componentsOutputs = [];

		/**
		 * p0 - not1 - p3
		 *                \
		 *                  and
		 *                /
		 *             p2
		 */
		const outer1 = new Component();
		const outer2 = new Component();

		const not = new Component([[{ componentIndex: 1, inputIndex: 0 }]], ([a]) => [Number(!a)]);

		const and = new Component([
			[{ componentIndex: 0, inputIndex: 0 }],
			[{ componentIndex: 2, inputIndex: 0 }]
		]);

		components.push(not, outer1, outer2, and);
		runComponents(components, componentsOutputs);
		console.log(componentsOutputs);
	});
});
