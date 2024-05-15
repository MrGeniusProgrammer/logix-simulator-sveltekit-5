import { bench, it } from 'vitest';
import { describe } from 'vitest';
import { Stack } from './stack';

describe.skip('comparing arrays with stacks', () => {
	describe('10 items', () => {
		const TOTAL_LENGTH = 10;

		bench('array', () => {
			const array = [];
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				array.push(i);
			}
		});

		bench('stack', () => {
			const stack = new Stack();
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				stack.push(i);
			}
		});
	});

	describe('1e2 items', () => {
		const TOTAL_LENGTH = 1e2;

		bench('array', () => {
			const array = [];
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				array.push(i);
			}
		});

		bench('stack', () => {
			const stack = new Stack();
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				stack.push(i);
			}
		});
	});

	describe('1e3 items', () => {
		const TOTAL_LENGTH = 1e3;

		bench('array', () => {
			const array = [];
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				array.push(i);
			}
		});

		bench('stack', () => {
			const stack = new Stack();
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				stack.push(i);
			}
		});
	});

	describe('1e5 items', () => {
		const TOTAL_LENGTH = 1e5;

		bench('array', () => {
			const array = [];
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				array.push(i);
			}
		});

		bench('stack', () => {
			const stack = new Stack();
			for (let i = 0; i < TOTAL_LENGTH; i++) {
				stack.push(i);
			}
		});
	});
});
