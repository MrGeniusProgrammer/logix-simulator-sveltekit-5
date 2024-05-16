<script>
	import {
		DrawVisualPin,
		VisualPin,
		Pin,
		STATE_LOW,
		VisualChip,
		DrawVisualChip
	} from '$lib/frontend/index';
	import { onMount } from 'svelte';

	const pin = new Pin(STATE_LOW, 'a', 0);
	const vp = new VisualPin(pin, { x: 150, y: 150 });

	const chip = new VisualChip([pin, pin], [pin], 'not', { x: 150, y: 150 });

	let width = $state(0);
	let height = $state(0);

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;

		window.addEventListener('resize', (e) => {
			width = window.innerWidth;
			height = window.innerHeight;
		});
	});

	/**
	 * @typedef MiddlePoint
	 * @property {"x" | "y"} direction
	 * @property {number} value
	 */

	/**
	 * @type {import('$lib/frontend').Vector2D[]}
	 */
	const middlePoints = [
		{
			x: 150,
			y: 0
		},
		{
			x: 0,
			y: 150
		},
		{
			x: -150,
			y: 0
		},
		{
			x: 0,
			y: -100
		}
	];

	/**
	 * @type {import('$lib/frontend').Vector2D}
	 */
	const start = { x: 450, y: 500 };

	/**
	 * @type {import('$lib/frontend').Vector2D}
	 */
	const end = { x: 400, y: 550 };

	let d = $state('');

	for (let i = 0; i < middlePoints.length; i++) {
		const point = middlePoints[i];
		d += `l ${point.x} ${point.y} `;
	}
</script>

<svg {width} {height} xmlns="http://www.w3.org/2000/svg" class="bg-slate-800">
	<DrawVisualPin visualPin="{vp}" />
	<DrawVisualChip visualChip="{chip}" />
	<path d="M {start.x} {start.y} {d} L {end.x} {end.y}" stroke="black" fill="transparent"></path>
</svg>
