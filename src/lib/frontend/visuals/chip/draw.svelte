<script>
	import {
		DEFAULT_CIRCUIT_PADDING_X,
		DEFAULT_CIRCUIT_PINS_GAP,
		DEFAULT_PIN_DIAMETER,
		DEFAULT_PIN_RADIUS
	} from '$lib/frontend/const';

	/**
	 * @type {import(".").DrawVisualChipProps}
	 */
	const { visualChip } = $props();

	let textWidth = $state(0);

	const width = $derived(DEFAULT_CIRCUIT_PADDING_X * 2 + textWidth);
	const maxNumberOfPins = Math.max(visualChip.outputPins.length, visualChip.inputPins.length);

	const height =
		DEFAULT_CIRCUIT_PINS_GAP * (maxNumberOfPins + 1) + maxNumberOfPins * DEFAULT_PIN_DIAMETER;

	const inputListOffset =
		(height -
			(DEFAULT_CIRCUIT_PINS_GAP * (visualChip.inputPins.length - 1) +
				visualChip.inputPins.length * DEFAULT_PIN_DIAMETER)) /
			2 +
		DEFAULT_PIN_RADIUS;

	const outputListOffset =
		(height -
			(DEFAULT_CIRCUIT_PINS_GAP * (visualChip.outputPins.length - 1) +
				visualChip.outputPins.length * DEFAULT_PIN_DIAMETER)) /
			2 +
		DEFAULT_PIN_RADIUS;

	/**
	 * @type {number[]}
	 */
	const inputPosY = [];

	let offset = inputListOffset;
	for (const pin of visualChip.inputPins) {
		inputPosY.push(offset);
		offset += DEFAULT_CIRCUIT_PINS_GAP + DEFAULT_PIN_DIAMETER;
	}

	/**
	 * @type {number[]}
	 */
	const outputPosY = [];

	offset = outputListOffset;
	for (const pin of visualChip.outputPins) {
		outputPosY.push(offset);
		offset += DEFAULT_CIRCUIT_PINS_GAP + DEFAULT_PIN_DIAMETER;
	}
</script>

<g transform="translate({visualChip.pos.x}, {visualChip.pos.y})" use:visualChip.element>
	<rect {width} {height}></rect>

	{#each inputPosY as cy, i}
		<circle cx="0" {cy} r="{DEFAULT_PIN_RADIUS}"></circle>
	{/each}

	<text bind:clientWidth="{textWidth}" x="{width / 2}" y="{height / 2}" alignment-baseline="middle"
		>{visualChip.name}</text
	>

	{#each outputPosY as cy, i}
		<circle cx="{width}" {cy} r="{DEFAULT_PIN_RADIUS}"></circle>
	{/each}
</g>

<style>
	rect {
		fill: black;
	}

	text {
		fill: white;
		text-anchor: middle;
	}

	circle {
		fill: slategray;
	}
</style>
