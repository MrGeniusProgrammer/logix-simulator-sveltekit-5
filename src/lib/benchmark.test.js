import { test } from 'vitest';
import { describe } from 'vitest';
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

import { runComponents, Component } from './anda';

test('bench marking backends', () => {
	const MAX_ITEARTIONS = 1e4;

	let total = 0;

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

	for (let i = 0; i < MAX_ITEARTIONS; i++) {
		const start = performance.now();
		runComponents(components, componentsOutputs);
		const end = performance.now();

		total += end - start;
	}

	total /= MAX_ITEARTIONS;
	console.log('backend 2 average run', total);

	total = 0;

	const p0 = new Pin(BACKEND_STATE_LOW);
	const p1 = new Pin(BACKEND_STATE_LOW);
	const p2 = new Pin(BACKEND_STATE_LOW);
	const p3 = new Pin(BACKEND_STATE_LOW);
	const p4 = new Pin(BACKEND_STATE_HIGH);
	const p5 = new Pin(BACKEND_STATE_HIGH);
	const p6 = new Pin(BACKEND_STATE_LOW);
	const p7 = new Pin(BACKEND_STATE_HIGH);
	const p8 = new Pin(BACKEND_STATE_HIGH);

	new BuiltinNotChip([p0], [p4]);
	new BuiltinAndChip([p4, p1], [p6]);
	new BuiltinNotChip([p2], [p5]);
	new BuiltinOrChip([p5, p3], [p7]);
	new BuiltinOrChip([p6, p7], [p8]);
	const customChip = new CustomChip([p0, p1, p2, p3], [p8]);

	const simulator = new Simulator(100);

	for (let i = 0; i < MAX_ITEARTIONS; i++) {
		const start = performance.now();
		simulator.runChip(customChip);
		const end = performance.now();

		total += end - start;
	}

	total /= MAX_ITEARTIONS;
	console.log('backend 1 average run', total);
});
