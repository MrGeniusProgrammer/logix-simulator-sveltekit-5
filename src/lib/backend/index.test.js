import { STATE_HIGH, STATE_LOW } from './state';
import {
	BuiltinAndChip,
	BuiltinNotChip,
	BuiltinOrChip,
	Pin,
	CustomChip,
	Simulator,
	Bus,
	BuiltinNAndChip
} from '.';
import { describe, it, expect, bench } from 'vitest';

describe('backend 1 test', () => {
	describe('circuit 0', () => {
		/**
		 * p0
		 *    \
		 *     or - p2
		 *    /
		 * p1
		 */

		const p0 = new Pin(STATE_LOW); // chips: [or]
		const p1 = new Pin(STATE_LOW); // chips: [or]
		const p2 = new Pin(STATE_LOW);

		const or = new BuiltinOrChip([p0, p1], [p2]);
		const simulator = new Simulator(10);

		it('p0 (0) p1 (0)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_LOW);
			simulator.runChip(or);
			expect(p2.state).toStrictEqual(STATE_LOW);
		});

		it('p0 (0) p1 (1)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_HIGH);
			simulator.runChip(or);
			expect(p2.state).toStrictEqual(STATE_HIGH);
		});

		it('p0 (1) p1 (0)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_LOW);
			simulator.runChip(or);
			expect(p2.state).toStrictEqual(STATE_HIGH);
		});

		it('p0 (1) p1 (1)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_HIGH);
			simulator.runChip(or);
			expect(p2.state).toStrictEqual(STATE_HIGH);
		});
	});

	describe.only('circuit 1', () => {
		/**
		 * circuit 1
		 * p0 - not0 - p4
		 *               \
		 *                and0 - p6
		 *               /         \
		 *             p1           \
		 *                           or1 - p8
		 * p2 - not1 - p5           /
		 *               \         /
		 *                or0 - p7
		 *               /
		 *             p3
		 */

		const p0 = new Pin(STATE_LOW); // chips: [not0, ]
		const p1 = new Pin(STATE_LOW); // chips: [and0]
		const p2 = new Pin(STATE_LOW); // chips: [not1, ]
		const p3 = new Pin(STATE_LOW);
		const p4 = new Pin(STATE_HIGH); // chips: [and0]
		const p5 = new Pin(STATE_HIGH);
		const p6 = new Pin(STATE_LOW);
		const p7 = new Pin(STATE_HIGH);
		const p8 = new Pin(STATE_HIGH);

		new BuiltinNotChip([p0], [p4]);
		new BuiltinAndChip([p4, p1], [p6]);
		new BuiltinNotChip([p2], [p5]);
		new BuiltinOrChip([p5, p3], [p7]);
		new BuiltinOrChip([p6, p7], [p8]);
		const customChip = new CustomChip([p0, p1, p2, p3], [p8]);

		const simulator = new Simulator(100);

		it.skip('p0 (0) p1 (0) p2 (0) p3 (0)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_LOW);
			p2.update(STATE_LOW);
			p3.update(STATE_LOW);

			simulator.runChip(customChip);

			expect(p0.state).toStrictEqual(STATE_LOW);
			expect(p1.state).toStrictEqual(STATE_LOW);
			expect(p2.state).toStrictEqual(STATE_LOW);
			expect(p3.state).toStrictEqual(STATE_LOW);

			expect(p4.state).toStrictEqual(STATE_HIGH);
			expect(p5.state).toStrictEqual(STATE_HIGH);

			expect(p6.state).toStrictEqual(STATE_LOW);
			expect(p7.state).toStrictEqual(STATE_HIGH);

			expect(p8.state).toStrictEqual(STATE_HIGH);
		});

		it.skip('p0 (1) p1 (0) p2 (0) p3 (0)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_LOW);
			p2.update(STATE_LOW);
			p3.update(STATE_LOW);

			simulator.runChip(customChip);

			expect(p0.state).toStrictEqual(STATE_HIGH);
			expect(p1.state).toStrictEqual(STATE_LOW);
			expect(p2.state).toStrictEqual(STATE_LOW);
			expect(p3.state).toStrictEqual(STATE_LOW);

			expect(p4.state).toStrictEqual(STATE_LOW);
			expect(p5.state).toStrictEqual(STATE_HIGH);

			expect(p6.state).toStrictEqual(STATE_LOW);
			expect(p7.state).toStrictEqual(STATE_HIGH);

			expect(p8.state).toStrictEqual(STATE_HIGH);

			expect(p8.state).toStrictEqual(STATE_HIGH);
		});

		it.skip('p0 (0) p1 (1) p2 (0) p3 (0)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_HIGH);
			p2.update(STATE_LOW);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_HIGH);
		});

		it.skip('p0 (1) p1 (1) p2 (0) p3 (0)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_HIGH);
			p2.update(STATE_LOW);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_HIGH);
		});

		it.skip('p0 (0) p1 (0) p2 (1) p3 (0)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_LOW);
			p2.update(STATE_HIGH);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);

			expect(p0.state).toStrictEqual(STATE_LOW);
			expect(p1.state).toStrictEqual(STATE_LOW);
			expect(p2.state).toStrictEqual(STATE_HIGH);
			expect(p3.state).toStrictEqual(STATE_LOW);

			expect(p4.state).toStrictEqual(STATE_HIGH);
			expect(p5.state).toStrictEqual(STATE_LOW);

			expect(p6.state).toStrictEqual(STATE_LOW);
			expect(p7.state).toStrictEqual(STATE_LOW);

			expect(p8.state).toStrictEqual(STATE_LOW);
		});

		it.skip('p0 (1) p1 (0) p2 (1) p3 (0)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_LOW);
			p2.update(STATE_HIGH);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_LOW);
		});

		it.skip('p0 (0) p1 (1) p2 (1) p3 (0)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_HIGH);
			p2.update(STATE_HIGH);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_HIGH);
		});

		it.skip('p0 (1) p1 (1) p2 (1) p3 (0)', () => {
			p0.update(STATE_HIGH);
			p1.update(STATE_HIGH);
			p2.update(STATE_HIGH);
			p3.update(STATE_LOW);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_LOW);
		});

		it.skip('p0 (0) p1 (0) p2 (0) p3 (1)', () => {
			p0.update(STATE_LOW);
			p1.update(STATE_LOW);
			p2.update(STATE_LOW);
			p3.update(STATE_HIGH);
			simulator.runChip(customChip);
			expect(p8.state).toStrictEqual(STATE_HIGH);
		});
	});

	it('circuit 2', () => {
		/**
		 * circuit 2
		 * p0 - not0 - p1
		 *               \
		 *                 p3 - not1 - p4
		 *               /
		 *            p2
		 */

		const p0 = new Pin(STATE_HIGH);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);
		const p3 = new Pin(STATE_LOW);
		const p4 = new Pin(STATE_LOW);

		p2.influencePin(p3);
		p1.influencePin(p3);

		const not0 = new BuiltinNotChip([p0], [p1]);
		const not1 = new BuiltinNotChip([p3], [p4]);
		const customChip = new CustomChip([p0, p2], [p4]);

		const simulator = new Simulator(100);
		simulator.runChip(customChip);
	});

	it('circuit 3', () => {
		/**
		 * circuit 3
		 *    p1    -----
		 * p1 - \  /      \
		 *        p4 not - p5
		 * p2 -  /
		 *     p3
		 */

		const p0 = new Pin(STATE_LOW);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);
		const p3 = new Pin(STATE_LOW);
		const p4 = new Pin(STATE_LOW);
		const p5 = new Pin(STATE_LOW);

		p0.influencePin(p4);
		p1.influencePin(p4);
		p2.influencePin(p4);
		p3.influencePin(p4);
		p5.influencePin(p4);

		const not = new BuiltinNotChip([p4], [p5]);
		const customChip = new CustomChip([p0, p1, p2, p3], [p5]);

		const simulator = new Simulator(100);
		simulator.runChip(customChip);
	});

	it('circuit 4', () => {
		/**
		 * circuit 4
		 * p0
		 *    \
		 *     |----- p2
		 *    /
		 * p1
		 */

		const p0 = new Pin(STATE_LOW);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);

		const bus = new Bus(STATE_LOW, [p0, p1], [p2]);
		const customChip = new CustomChip([p0, p1], [p2]);

		const simulator = new Simulator(100);

		simulator.runUpdatePins(p0.update(STATE_HIGH));
		expect(bus.state).toEqual(STATE_HIGH);

		simulator.runUpdatePins(p0.update(STATE_LOW));
		expect(bus.state).toEqual(STATE_LOW);
	});

	it('circuit 6', () => {
		/**
		 * circuit 3 solved infinite loop
		 *    p1    -----
		 * p1 - \  /      \
		 *        p4 not - p5
		 * p2 -  /
		 *     p3
		 */

		const p0 = new Pin(STATE_LOW);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);
		const p3 = new Pin(STATE_LOW);
		const p4 = new Pin(STATE_LOW);
		const p5 = new Pin(STATE_LOW);

		p0.influencePin(p4);
		p1.influencePin(p4);
		p2.influencePin(p4);
		p3.influencePin(p4);
		p5.influencePin(p4);

		const not = new BuiltinNotChip([p4], [p5]);
		const customChip = new CustomChip([p0, p1, p2, p3], [p5]);
		const simulator = new Simulator(50);
		simulator.runChip(customChip);
	});

	it('circuit 7', () => {
		/**
		 * p0 - nand - p2
		 *       \------ \ ------
		 *                \      \
		 * p1 ------------ nand - p3
		 */

		const p0 = new Pin(STATE_LOW);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);
		const p3 = new Pin(STATE_LOW);

		const nand0 = new BuiltinNAndChip([p0, p3], [p2]);
		const nand1 = new BuiltinNAndChip([p1, p2], [p3]);

		const customChip = new CustomChip([p0, p1], [p3, p2]);
		const simulator = new Simulator(1);

		simulator.runChip(customChip);
		// expect(p3.state).toStrictEqual(STATE_HIGH);
	});

	it('circuit 8', () => {
		/**
		 * p0 - nand - p2 - nand - p3
		 *    /          \   \------ \ ------
		 *   /            \           \      \
		 * p1 ------------ nand - p4 - nand - p5
		 */

		const p0 = new Pin(STATE_LOW);
		const p1 = new Pin(STATE_LOW);
		const p2 = new Pin(STATE_LOW);
		const p3 = new Pin(STATE_LOW);
		const p4 = new Pin(STATE_LOW);
		const p5 = new Pin(STATE_LOW);

		const nand0 = new BuiltinNAndChip([p0, p1], [p2]);
		const nand1 = new BuiltinNAndChip([p1, p2], [p4]);
		const nand2 = new BuiltinNAndChip([p2, p5], [p3]);
		const nand3 = new BuiltinNAndChip([p4, p3], [p5]);

		const customChip = new CustomChip([p0, p1], [p3, p5]);
		const simulator = new Simulator(1);
		simulator.runChip(customChip);
	});
});
