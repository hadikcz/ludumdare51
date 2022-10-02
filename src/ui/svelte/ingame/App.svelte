<script lang="ts">
    import GameScene from "scenes/GameScene";
	import {onDestroy} from "svelte";
	import './global.css';
	import Hud from "ui/svelte/ingame/Hud/Hud.svelte";
	import CoinBar from "ui/svelte/ingame/CoinBar.svelte";
	import BuildingInfo from "ui/svelte/ingame/BuildingInfo.svelte";
	import ChickenBar from "ui/svelte/ingame/ChickenBar.svelte";
	import BabyChickenBar from "ui/svelte/ingame/BabyChickenBar.svelte";
	import Shop from "ui/svelte/ingame/shop/Shop.svelte";
	import FeederModal from "ui/svelte/ingame/modals/FeederModal.svelte";
	import WellModal from "ui/svelte/ingame/modals/WellModal.svelte";
	import ChickenModal from "ui/svelte/ingame/modals/ChickenModal.svelte";

    export let scene: GameScene;


	let coins = 0;
	scene.shop.coins$.subscribe((value) => {
		coins = value;
	});

	onDestroy(() => {
		console.log('main app svelte DESTYROYD');
	});

	let visibleHud = true;

</script>

<style lang="scss">
	.top-bar {
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		font-size: 25px;
		position: absolute;
	}
</style>

<main style="pointer-events: all">
	<Hud valueX="12" visible="{visibleHud}"></Hud>
	<div class="top-bar">
		<CoinBar scene="{scene}"></CoinBar>
		<ChickenBar scene="{scene}"></ChickenBar>
		<BabyChickenBar scene="{scene}"></BabyChickenBar>
	</div>
	<BuildingInfo scene="{scene}"></BuildingInfo>
	<Shop scene="{scene}"></Shop>

	<FeederModal scene="{scene}" coins="{coins}"></FeederModal>
	<WellModal scene="{scene}"></WellModal>
	<ChickenModal scene="{scene}"></ChickenModal>
</main>
