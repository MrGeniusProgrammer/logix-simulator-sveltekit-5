<script>
	import {
		VisualPin,
		Pin,
		STATE_LOW,
		VisualChip,
		VisualWire,
		DEFAULT_PIN_RADIUS,
		STATE_HIGH,
		BackendAdapter
	} from '$lib/frontend/index';
	import { onMount } from 'svelte';

	const backendAdapter = new BackendAdapter(100);

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;

	let showCreateMenu = $state(false);

	/**
	 * @type {import('$lib/frontend').Vector2D}
	 */
	let createMenuPos = $state({ x: 0, y: 0 });

	/**
	 * @type {(inputNames: string[], outputNames: string[], name: string, type: import("$lib/frontend/adapter").ChipType) => void}
	 */
	let createChip = $state(() => {});

	/**
	 * @type {(name: string) => void}
	 */
	let createPin = $state(() => {});

	onMount(() => {
		/**
		 * @type {CanvasRenderingContext2D}
		 */
		const ctx = canvas.getContext('2d');

		if (ctx === null) {
			return;
		}

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		window.addEventListener('resize', (e) => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});

		/**
		 * @type {Pin[]}
		 */
		const pins = [];

		/**
		 * @type {VisualPin[]}
		 */
		const allVisualPins = [];

		/**
		 * @type {VisualPin[]}
		 */
		const freeVisualPins = [];

		/**
		 * @type {VisualChip[]}
		 */
		const chips = [];
		/**
		 * @type {VisualWire[]}
		 */
		const wires = [];

		/**
		 * @type {VisualWire | undefined}
		 */
		let wirePending = undefined;

		let ctrlDown = false;

		/**
		 * @type {VisualChip | undefined}
		 */
		let chipDragging = undefined;

		/**
		 * @type {import('$lib/frontend').Vector2D}
		 */
		let diffChipClick = {
			x: 0,
			y: 0
		};

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			backendAdapter.run();

			for (const pin of pins) {
				const state = backendAdapter.getState(pin.id);
				if (state === undefined) continue;

				pin.state = state;
			}

			for (const wire of wires) {
				wire.draw(ctx);
			}

			if (wirePending !== undefined) {
				wirePending.draw(ctx);
			}

			for (const visualPin of freeVisualPins) {
				visualPin.draw(ctx);
			}

			for (const chip of chips) {
				chip.draw(ctx);
			}

			requestAnimationFrame(draw);
		}

		canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();

			const mouseX = e.offsetX;
			const mouseY = e.offsetY;

			if (wirePending !== undefined) {
				wirePending = undefined;
				return;
			}

			for (let i = 0; i < wires.length; i++) {
				const wire = wires[i];
				const length = wire.points.length;
				for (let i = 0; i < length - 1; i++) {
					const curr = wire.points[i];
					const next = wire.points[i + 1];

					/**
					 * @type {import('$lib/temp').Vector2D}
					 */
					let diffPoints = {
						x: curr.x - next.x,
						y: curr.y - next.y
					};

					const diffPointsLength = Math.sqrt(
						diffPoints.x * diffPoints.x + diffPoints.y * diffPoints.y
					);
					diffPoints.x /= diffPointsLength;
					diffPoints.y /= diffPointsLength;

					if (
						(diffPoints.x > 0 && mouseX < next.x) ||
						(diffPoints.x < 0 && mouseX > next.x) ||
						(diffPoints.y > 0 && mouseY < next.y) ||
						(diffPoints.y < 0 && mouseY > next.y)
					)
						continue;

					/**
					 * @type {import('$lib/temp').Vector2D}
					 */
					let diffMouse = {
						x: curr.x - mouseX,
						y: curr.y - mouseY
					};

					const diffMouseLength = Math.sqrt(diffMouse.x * diffMouse.x + diffMouse.y * diffMouse.y);
					diffMouse.x /= diffMouseLength;
					diffMouse.y /= diffMouseLength;

					let dot = diffPoints.x * diffMouse.x + diffPoints.y * diffMouse.y;
					if (dot >= -0.99 && dot >= 0.99) {
						wires.splice(i, 1);
						return;
					}
				}
			}

			if (!showCreateMenu) {
				showCreateMenu = true;
				createMenuPos.x = mouseX;
				createMenuPos.y = mouseY;
			}
		});

		canvas.addEventListener('mousedown', (e) => {
			e.preventDefault();

			showCreateMenu = false;

			const mouseX = e.offsetX;
			const mouseY = e.offsetY;

			if (ctrlDown) {
				for (const visualPin of freeVisualPins) {
					/**
					 * @type {import('$lib/frontend').Vector2D}
					 */
					const diff = {
						x: visualPin.pos.x - mouseX,
						y: visualPin.pos.y - mouseY
					};

					const length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
					const isIntersecting = length <= DEFAULT_PIN_RADIUS;

					if (isIntersecting) {
						backendAdapter.updateState(
							visualPin.pin.id,
							visualPin.pin.state === STATE_HIGH ? STATE_LOW : STATE_HIGH
						);
						return;
					}
				}

				return;
			}

			let isPinIntersecting = false;

			for (const visualPin of allVisualPins) {
				/**
				 * @type {import('$lib/temp').Vector2D}
				 */
				const diff = {
					x: visualPin.pos.x - mouseX,
					y: visualPin.pos.y - mouseY
				};

				const length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
				isPinIntersecting = length <= DEFAULT_PIN_RADIUS;

				if (isPinIntersecting) {
					if (wirePending === undefined) {
						wirePending = new VisualWire(visualPin, {
							x: mouseX,
							y: mouseY
						});
					} else {
						backendAdapter.onAddEdge(wirePending.startPin.pin.id, visualPin.pin.id);
						wirePending.points[wirePending.points.length - 1] = visualPin.pos;
						wires.push(wirePending);
						wirePending = undefined;
					}
					break;
				}
			}

			if (wirePending !== undefined && !isPinIntersecting) {
				wirePending.points.push({ x: mouseX, y: mouseY });
			}

			if (wirePending === undefined) {
				for (const chip of chips) {
					let isIntersecting =
						mouseX <= chip.pos.x + chip.width &&
						mouseX >= chip.pos.x &&
						mouseY <= chip.pos.y + chip.height &&
						mouseY >= chip.pos.y;

					if (isIntersecting) {
						diffChipClick.x = chip.pos.x - mouseX;
						diffChipClick.y = chip.pos.y - mouseY;
						chipDragging = chip;

						break;
					}
				}
			}
		});

		canvas.addEventListener('mousemove', (e) => {
			const mouseX = e.offsetX;
			const mouseY = e.offsetY;

			if (wirePending !== undefined) {
				const lastIndex = wirePending.points.length - 1;
				wirePending.points[lastIndex].x = mouseX;
				wirePending.points[lastIndex].y = mouseY;
				return;
			}

			if (chipDragging !== undefined) {
				chipDragging.pos.x = mouseX + diffChipClick.x;
				chipDragging.pos.y = mouseY + diffChipClick.y;
				return;
			}
		});

		canvas.addEventListener('mouseup', (e) => {
			if (chipDragging !== undefined) {
				chipDragging = undefined;
				return;
			}
		});

		document.addEventListener('keydown', (e) => {
			ctrlDown = e.ctrlKey;
		});

		document.addEventListener('keyup', (e) => {
			ctrlDown = e.ctrlKey;
		});

		createChip = (inputNames, outputNames, name, type) => {
			/**
			 * @type {VisualPin[]}
			 */
			const inputPins = new Array(inputNames.length);

			for (let i = 0; i < inputNames.length; i++) {
				const pin = new Pin(STATE_LOW, inputNames[i], backendAdapter.onCreatePin());
				inputPins[i] = new VisualPin(pin);

				allVisualPins.push(inputPins[i]);
				pins.push(pin);
			}

			/**
			 * @type {VisualPin[]}
			 */
			const outputPins = new Array(outputNames.length);

			for (let i = 0; i < outputNames.length; i++) {
				const pin = new Pin(STATE_LOW, outputNames[i], backendAdapter.onCreatePin());
				outputPins[i] = new VisualPin(pin);

				allVisualPins.push(outputPins[i]);
				pins.push(pin);
			}

			chips.push(
				new VisualChip(ctx, inputPins, outputPins, { x: createMenuPos.x, y: createMenuPos.y }, name)
			);

			backendAdapter.onCreateChip(
				inputPins.map((v) => v.pin.id),
				outputPins.map((v) => v.pin.id),
				type
			);
		};

		createPin = (name) => {
			const pin = new Pin(STATE_LOW, name, backendAdapter.onCreatePin());
			const vp = new VisualPin(pin, { x: createMenuPos.x, y: createMenuPos.y });

			pins.push(pin);
			allVisualPins.push(vp);
			freeVisualPins.push(vp);
		};

		draw();
	});
</script>

<canvas bind:this="{canvas}"></canvas>
<div
	class="fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
	data-state="{showCreateMenu ? 'open' : 'closed'}"
	data-side="right"
	style="top: {createMenuPos.y}px; left: {createMenuPos.x}px;"
	tabindex="-1"
>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a', 'b'], ['o'], 'AND', 'and');
			showCreateMenu = false;
		}}"
	>
		<span>Create AND Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a', 'b'], ['o'], 'NAND', 'nand');
			showCreateMenu = false;
		}}"
	>
		<span>Create NAND Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a', 'b'], ['o'], 'OR', 'or');
			showCreateMenu = false;
		}}"
	>
		<span>Create OR Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a', 'b'], ['o'], 'NOR', 'nor');
			showCreateMenu = false;
		}}"
	>
		<span>Create NOR Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a', 'b'], ['o'], 'XOR', 'xor');
			showCreateMenu = false;
		}}"
	>
		<span>Create XOR Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createChip(['a'], ['o'], 'NOT', 'not');
			showCreateMenu = false;
		}}"
	>
		<span>Create NOT Gate</span>
	</div>
	<div
		tabindex="-1"
		class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		onclick="{() => {
			createPin('a');
			showCreateMenu = false;
		}}"
	>
		<span>Create PIN</span>
	</div>
</div>
