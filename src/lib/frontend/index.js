import { Pin } from './pin';
import { STATE_LOW } from './state';
import { VisualChip, VisualPin } from './visual';

/**
 * @type {HTMLDivElement}
 */
const root = document.getElementById('canvas');

const visualChip = new VisualChip(
	root,
	[new Pin(STATE_LOW, 'a', 0), new Pin(STATE_LOW, 'b', 1)],
	[new Pin(STATE_LOW, 'o', 2)],
	'and',
	{
		x: 150,
		y: 150
	}
);

const visualPin = new VisualPin(root, new Pin(STATE_LOW, 'anda', 5), { x: 450, y: 230 });

root.appendChild(visualChip.element);
visualChip.handleDrag();

visualPin.element.classList.add('free-pin');
root.appendChild(visualPin.element);
visualPin.handleDrag();
