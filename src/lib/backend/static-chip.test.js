import { test } from 'vitest';
import { describe } from 'vitest';
import { BuiltinAndChip, BuiltinNotChip, BuiltinOrChip } from './builtin-chips';
import { StaticChip } from './static-chip';
import { Pin } from './pin';
import { STATE_HIGH, STATE_LOW } from './state';
import { expect } from 'vitest';
import { it } from 'vitest';

describe.skip('statically generate truth table of builtin chip and test their truth tables', () => {
	describe('and chip', () => {
		const truthTable = BuiltinAndChip.generateTruthTable();
		const a = new Pin(STATE_LOW);
		const b = new Pin(STATE_LOW);
		const o = new Pin(STATE_LOW);
		const chip = new StaticChip([a, b], [o], truthTable);

		it('input [0, 0]', () => {
			a.update(STATE_LOW);
			b.update(STATE_LOW);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_LOW, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [0, 1]', () => {
			a.update(STATE_LOW);
			b.update(STATE_HIGH);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_LOW, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [1, 0]', () => {
			a.update(STATE_HIGH);
			b.update(STATE_LOW);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_LOW, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [1, 1]', () => {
			a.update(STATE_HIGH);
			b.update(STATE_HIGH);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_HIGH, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});
	});

	describe('or chip', () => {
		const truthTable = BuiltinOrChip.generateTruthTable();
		const a = new Pin(STATE_LOW);
		const b = new Pin(STATE_LOW);
		const o = new Pin(STATE_LOW);
		const chip = new StaticChip([a, b], [o], truthTable);

		it('input [0, 0]', () => {
			a.update(STATE_LOW);
			b.update(STATE_LOW);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_LOW, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [0, 1]', () => {
			a.update(STATE_LOW);
			b.update(STATE_HIGH);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_HIGH, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [1, 0]', () => {
			a.update(STATE_HIGH);
			b.update(STATE_LOW);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_HIGH, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [1, 1]', () => {
			a.update(STATE_HIGH);
			b.update(STATE_HIGH);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_HIGH, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});
	});

	describe('not chip', () => {
		const truthTable = BuiltinNotChip.generateTruthTable();
		const a = new Pin(STATE_LOW);
		const o = new Pin(STATE_LOW);
		const chip = new StaticChip([a], [o], truthTable);

		it('input [o]', () => {
			a.update(STATE_LOW);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_HIGH, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});

		it('input [1]', () => {
			a.update(STATE_HIGH);

			const updatePins = chip.process();

			/**
			 * @type {import("./pin").UpdatePins}
			 */
			const expectingPins = new Map();
			expectingPins.set(STATE_LOW, [o]);

			expect(updatePins).toStrictEqual(expectingPins);
		});
	});
});
