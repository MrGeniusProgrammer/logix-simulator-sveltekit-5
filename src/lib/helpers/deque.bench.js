import { bench, it } from 'vitest';
import { describe } from 'vitest';
import { Deque } from './deque';

describe.skip('comparing arrays with deques', () => {
	describe('10 items', () => {
		const TOTAL_LENGTH = 10;

		describe('push back', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.push(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushBack(i);
				}
			});
		});

		describe('push front', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.unshift(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushFront(i);
				}
			});
		});
	});

	describe('1e2 items', () => {
		const TOTAL_LENGTH = 1e2;

		describe('push back', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.push(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushBack(i);
				}
			});
		});

		describe('push front', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.unshift(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushFront(i);
				}
			});
		});
	});

	describe('1e3 items', () => {
		const TOTAL_LENGTH = 1e3;

		describe('push back', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.push(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushBack(i);
				}
			});
		});

		describe('push front', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.unshift(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushFront(i);
				}
			});
		});
	});

	describe.skip('1e5 items', () => {
		const TOTAL_LENGTH = 1e5;

		describe('push back', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.push(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushBack(i);
				}
			});
		});

		describe('push front', () => {
			bench('array', () => {
				const array = [];
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					array.unshift(i);
				}
			});

			bench('deque', () => {
				const deque = new Deque();
				for (let i = 0; i < TOTAL_LENGTH; i++) {
					deque.pushFront(i);
				}
			});
		});
	});
});
