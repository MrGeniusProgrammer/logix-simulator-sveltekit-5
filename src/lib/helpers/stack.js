/**
 * @template T
 */
export class Stack {
	constructor() {
		/**
		 * @type {DoubleLinkedItem<T> | undefined}
		 */
		this.back = undefined;

		this.size = 0;
	}

	/**
	 * @returns {T | undefined}
	 */
	peek() {
		if (this.back !== undefined) {
			return this.back.value;
		}

		return undefined;
	}

	/**
	 * @param {T} value
	 */
	push(value) {
		if (this.back === undefined) {
			this.back = {
				value
			};
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
	pop() {
		if (this.back === undefined) {
			return undefined;
		}

		const value = this.back.value;
		this.back = this.back.prev;
		this.size--;

		return value;
	}
}
