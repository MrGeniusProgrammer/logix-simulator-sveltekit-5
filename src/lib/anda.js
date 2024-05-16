import { STATE_HIGH, STATE_HIGH_Z, STATE_LOW } from './const';

export class Component {
	/**
	 *
	 * @param {number[][][]} ComponentIndexInputs [[[m,n]], [[p,q]]] -> componentOutputs[m][n], componentOutputs[p][q]
	 * @param {([...args]) => void} executeFn
	 */
	constructor(ComponentIndexInputs = [], executeFn = () => [0]) {
		this.ComponentIndexInputs = ComponentIndexInputs;
		this.executeFn = executeFn;
	}
}

/**
 *
 * @param {Component[]} components
 * @param {number[][]} componentsOutputs
 */
export function runComponents(components, componentsOutputs) {
	// componentsOutputs.length = 0;
	// let state = true;

	// let NonXMode = true;

	// [...components];

	const xComponentsIndexes = [];

	while (true) {
		if (componentsOutputs.length === 0) {
			for (let i = 0; i < components.length; i++) {
				let c = components[i];
				if (c.ComponentIndexInputs.length > 0) {
					let isFlagAlreadyNeg = false;
					const inputs = [];
					for (const multiInput of c.ComponentIndexInputs) {
						let overallInput = 0;
						for (const [j, k] of multiInput) {
							if (j in componentsOutputs) {
								const input = componentsOutputs[j][k];
								if (input === 1) {
									overallInput = 1;
									break;
								} else if (input === -1) {
									isFlagAlreadyNeg = true;
									break;
								}
							} else {
								isFlagAlreadyNeg = true;
								break;
							}
						}
						if (isFlagAlreadyNeg) {
							break;
						} else {
							inputs.push(overallInput);
						}
					}
					if (isFlagAlreadyNeg) {
						componentsOutputs.push([-1]);
						xComponentsIndexes.push(i);
						continue;
					} else {
						const outputs = c.executeFn(inputs);
						componentsOutputs.push(outputs); // reassign the [-1] to this new outputs
					}
				} else {
					componentsOutputs.push(c.executeFn());
				}
			}
		}
		if (xComponentsIndexes.length > 0 && components.length === componentsOutputs.length) {
			for (const i of xComponentsIndexes) {
				let c = components[i];
				const inputs = [];
				let isFlagAlreadyNeg = false;
				for (const multiInput of c.ComponentIndexInputs) {
					let overallInput = 0;
					for (const [j, k] of multiInput) {
						const input = componentsOutputs[j][k];
						if (input === 1) {
							overallInput = 1;
							break;
						} else if (input === -1) {
							isFlagAlreadyNeg = true;
							break;
						}
					}
					if (isFlagAlreadyNeg) {
						break;
					} else {
						inputs.push(overallInput);
					}
				}
				if (isFlagAlreadyNeg) {
					continue;
				} else {
					componentsOutputs[i] = c.executeFn(inputs);
					xComponentsIndexes.splice(xComponentsIndexes.indexOf(i), 1);
				}
			}
		}
		if (xComponentsIndexes.length === 0) {
			break;
		}
	}
}
