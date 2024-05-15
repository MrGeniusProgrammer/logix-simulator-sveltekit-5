/**
 * @template T
 * @typedef DoubleLinkedItem
 * @property {DoubleLinkedItem | undefined} prev
 * @property {DoubleLinkedItem | undefined} next
 * @property {T} value
 */

/**
 * @template T
 */
export class Deque {
	constructor() {
		/**
		 * @type {DoubleLinkedItem<T> | undefined}
		 */
		this.start = undefined;

		/**
		 * @type {DoubleLinkedItem<T> | undefined}
		 */
		this.front = undefined;

		this.size = 0;
	}

	/**
	 * @returns {T | undefined}
	 */
	peekBack() {
		if (this.back !== undefined) {
			return this.back.value;
		}

		return undefined;
	}

	/**
	 * @param {T} value
	 */
	pushBack(value) {
		if (this.back === undefined) {
			this.back = {
				value
			};

			this.front = { value };
		} else {
			const temp = { ...this.back };
			temp.next = this.back;
			this.back = {
				value,
				prev: temp
			};
		}

		this.size++;
	}

	/**
	 * @returns {T | undefined}
	 */
	popBack() {
		if (this.back === undefined) {
			return undefined;
		}

		const value = this.back.value;
		this.back = this.back.prev;
		this.size--;

		return value;
	}

	/**
	 * @returns {T | undefined}
	 */
	peekFront() {
		if (this.front !== undefined) {
			return this.front.value;
		}

		return undefined;
	}

	/**
	 * @param {T} value
	 */
	pushFront(value) {
		if (this.front === undefined) {
			this.front = {
				value
			};

			this.back = { value };
		} else {
			const temp = { ...this.front };
			temp.prev = this.front;
			this.front = {
				value,
				next: temp
			};
		}

		this.size++;
	}

	/**
	 * @returns {T | undefined}
	 */
	popFront() {
		if (this.front === undefined) {
			return undefined;
		}

		const value = this.front.value;
		this.front = this.front.next;
		this.size--;

		return value;
	}
}
