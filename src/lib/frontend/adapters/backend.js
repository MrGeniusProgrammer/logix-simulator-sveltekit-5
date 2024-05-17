import {
	BuiltinAndChip,
	BuiltinNAndChip,
	BuiltinNotChip,
	BuiltinOrChip,
	Chip,
	CustomChip,
	Pin,
	Simulator,
	STATE_LOW as BACKEND_STATE_LOW,
	STATE_HIGH as BACKEND_STATE_HIGH,
	BuiltinXOrChip
} from '$lib/backend';
import { BuiltinNOrChip } from '$lib/backend/builtin-chips/bultin-nor-chip';
import { Adapter } from '../adapter';
import { STATE_HIGH, STATE_LOW } from '../state';

/**
 * @extends Adapter<Pin>
 */
export class BackendAdapter extends Adapter {
	/**
	 * @param {number} maxIteration
	 */
	constructor(maxIteration) {
		super();

		this.simulator = new Simulator(maxIteration);
	}

	/**
	 *
	 * @returns {Pin}
	 */
	onCreatePin() {
		const pin = new Pin(BACKEND_STATE_LOW);
		return pin;
	}

	/**
	 *
	 * @param {Pin} startId
	 * @param {Pin} endId
	 * @returns {boolean}
	 */
	onAddEdge(startId, endId) {
		startId.influencePin(endId);
		this.simulator.runUpdatePins(startId.update(startId.state));
		return true;
	}

	/**
	 * @param {Pin[]} inputPinIds
	 * @param {Pin[]} outputPinIds
	 * @param {import('../adapter').ChipType} type
	 * @returns {boolean}
	 */
	onCreateChip(inputPinIds, outputPinIds, type) {
		switch (type) {
			case 'and':
				this.simulator.runChip(new BuiltinAndChip(inputPinIds, outputPinIds));
				return true;

			case 'or':
				this.simulator.runChip(new BuiltinOrChip(inputPinIds, outputPinIds));
				return true;

			case 'xor':
				this.simulator.runChip(new BuiltinXOrChip(inputPinIds, outputPinIds));
				return true;

			case 'not':
				this.simulator.runChip(new BuiltinNotChip(inputPinIds, outputPinIds));
				return true;

			case 'nor':
				this.simulator.runChip(new BuiltinNOrChip(inputPinIds, outputPinIds));
				return true;

			case 'nand':
				this.simulator.runChip(new BuiltinNAndChip(inputPinIds, outputPinIds));
				return true;

			case 'custom':
				this.simulator.runChip(new CustomChip(inputPinIds, outputPinIds));
				return true;

			default:
				return false;
		}
	}

	run() {
		this.simulator.runUpdatePins();
	}

	/**
	 *
	 * @param {Pin} id
	 * @returns {import('../state').State | undefined}
	 */
	getState(id) {
		const backendState = id.state;
		return backendState === BACKEND_STATE_LOW ? STATE_LOW : STATE_HIGH;
	}

	/**
	 *
	 * @param {Pin} id
	 * @param {import("../state").State} state
	 * @returns {boolean}
	 */
	updateState(id, state) {
		this.simulator.runUpdatePins(
			id.update(state === STATE_LOW ? BACKEND_STATE_LOW : BACKEND_STATE_HIGH)
		);
		return true;
	}
}
