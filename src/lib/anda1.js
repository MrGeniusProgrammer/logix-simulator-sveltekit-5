import { STATE_HIGH, STATE_HIGH_Z, STATE_LOW } from './const';

/**
 * @typedef ComponentInput
 * @property {number} componentIndex
 * @property {number} inputIndex
 */

export class Component {
	/**
	 *
	 * @param {ComponentInput[][]} componentInputs
	 * @param {() => void} executeFn
	 */
	constructor(componentInputs = [], executeFn = () => [0]) {
		this.componentInputs = componentInputs;
		this.executeFn = executeFn;
	}
}

/**
 * @typedef ComponentWithIndex
 * @property {Component} component
 * @property {number} index
 */

/**
 *
 * @param {Component[]} components
 * @param {number[][]} componentsOutputs
 */
export function runComponents(components, componentsOutputs) {
	componentsOutputs.length = 0;

	/**
	 * @type {ComponentWithIndex[]}
	 */
	let pendingComponents = components.map((v, i) => ({ component: v, index: i }));

	while (pendingComponents.length > 0) {
		/**
		 * take the first component from the pending components
		 * @type {ComponentWithIndex}
		 */
		const { component, index } = pendingComponents.shift();

		// check if it has inputs
		if (component.componentInputs.length > 0) {
			const inputs = [];
			let isFlagAlreadyNeg = false;
			for (const multiInput of component.componentInputs) {
				let overallInput = 0;
				for (const { componentIndex, inputIndex } of multiInput) {
					let input = componentsOutputs[componentIndex];

					// check if the input is in the component outputs
					if (input !== undefined) {
						// take the value of the component by using the input index
						input = input[inputIndex];
						if (input === 1) {
							overallInput = 1;
							break;
						} else if (input === -1) {
							overallInput = -1;
							isFlagAlreadyNeg = true;
							break;
						}
					} else {
						isFlagAlreadyNeg = true;
						overallInput = -1;
						break;
					}
				}

				// already has -1 break
				if (isFlagAlreadyNeg) {
					break;
				}

				inputs.push(overallInput);
			}

			if (isFlagAlreadyNeg) {
				// does not exceed the componet outputs grater component length
				if (componentsOutputs.length < components.length) {
					componentsOutputs.push([-1]);
					pendingComponents.push({ component, index });
				}
			} else {
				const outputs = component.executeFn(inputs);
				componentsOutputs[index] = outputs;
			}
		} else {
			componentsOutputs.push(component.executeFn());
		}
	}
}
