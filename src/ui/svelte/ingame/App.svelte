<script lang="ts">
    import GameScene from "scenes/GameScene";
	import {onDestroy} from "svelte";
	import './global.css';
	import Hud from "ui/svelte/ingame/Hud/Hud.svelte";

    export let scene: GameScene;

	console.log(scene.sys.isPaused());

	onDestroy(() => {
		console.log('main app svelte DESTYROYD');
	});

	let visibleHud = true;

</script>

<main>
	<Hud valueX="12" visible="{visibleHud}"></Hud>
</main>
