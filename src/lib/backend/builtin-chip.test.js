import { it } from 'vitest';
import { describe } from 'vitest';
import { BuiltinAndChip, BuiltinNotChip, BuiltinOrChip } from './builtin-chips';
import { Pin } from './pin';
import { STATE_LOW, STATE_HIGH } from './state';
import { expect } from 'vitest';

describe.skip('generating truth tables', () => {
	it('and chip', () => {
		const chip = new BuiltinAndChip([new Pin(STATE_LOW), new Pin(STATE_LOW)], [new Pin(STATE_LOW)]);

		const truthTable = chip.generateTruthTable();

		expect(truthTable).toStrictEqual([[STATE_LOW], [STATE_LOW], [STATE_LOW], [STATE_HIGH]]);
	});

	it('or chip', () => {
		const chip = new BuiltinOrChip([new Pin(STATE_LOW), new Pin(STATE_LOW)], [new Pin(STATE_LOW)]);

		const truthTable = chip.generateTruthTable();

		expect(truthTable).toStrictEqual([[STATE_LOW], [STATE_HIGH], [STATE_HIGH], [STATE_HIGH]]);
	});

	it('not chip', () => {
		const chip = new BuiltinNotChip([new Pin(STATE_LOW)], [new Pin(STATE_LOW)]);

		const truthTable = chip.generateTruthTable();

		expect(truthTable).toStrictEqual([[STATE_HIGH], [STATE_LOW]]);
	});
});
