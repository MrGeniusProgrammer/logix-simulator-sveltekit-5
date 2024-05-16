<script>
	/**
	 * @type {import(".").VisualPinProps}
	 */
	const { visualPin } = $props();
</script>

<circle cx="{visualPin.pos.x}" cy="{visualPin.pos.y}" use:visualPin.element></circle>

<style>
	circle {
		r: 10;
	}
</style>
