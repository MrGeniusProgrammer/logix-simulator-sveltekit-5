import { it } from 'vitest';
import { describe } from 'vitest';
import { Deque } from './deque';
import { expect } from 'vitest';

describe.skip('deque', () => {
	it('should push back', () => {
		/**
		 * @type {Deque<number>}
		 */
		const deque = new Deque();

		deque.pushBack(1);
		deque.pushBack(2);
		deque.pushBack(3);

		expect(deque.peekBack()).toStrictEqual(3);
		expect(deque.peekFront()).toStrictEqual(1);
		expect(deque.size).toStrictEqual(3);
	});

	it('should push front', () => {
		/**
		 * @type {Deque<number>}
		 */
		const deque = new Deque();

		deque.pushFront(1);
		deque.pushFront(2);
		deque.pushFront(3);

		expect(deque.peekFront()).toStrictEqual(3);
		expect(deque.peekBack()).toStrictEqual(1);
		expect(deque.size).toStrictEqual(3);
	});

	it('should pop front', () => {
		/**
		 * @type {Deque<number>}
		 */
		const deque = new Deque();

		deque.pushFront(1);
		deque.pushFront(2);
		deque.pushFront(3);

		deque.popFront();

		expect(deque.peekFront()).toStrictEqual(2);
		expect(deque.peekBack()).toStrictEqual(1);
		expect(deque.size).toStrictEqual(2);
	});

	it('should pop back', () => {
		/**
		 * @type {Deque<number>}
		 */
		const deque = new Deque();

		deque.pushBack(1);
		deque.pushBack(2);
		deque.pushBack(3);

		deque.popBack();

		expect(deque.peekFront()).toStrictEqual(1);
		expect(deque.peekBack()).toStrictEqual(2);
		expect(deque.size).toStrictEqual(2);
	});
});
