<script lang="ts">
    import GameScene from "scenes/GameScene";
    import {Events} from "enums/Events";

    export let scene: GameScene;

    let visible = false;
    scene.builder.buildModeRunning$.subscribe((val) => {
       visible = val;
    });

    function handleCancel(): void {
        visible = false;
        scene.events.emit(Events.CANCEL_BUILDING)
    }
</script>

<style lang="scss">
  .actionInfo {
    padding: 5px;
    height: auto;
    background: rgba(0,0,0, 0.5);
    left: 50%;
    top: 100px;
    position: absolute;
    transform: translateX(-50%);
    color: white;
    font-size: 20px;
    z-index: 1000;
    pointer-events: all
  }


  .actionMenu {
    //position: absolute;
    //top: 130px;
    //right: 0;
    //width: auto;
    //height: auto;
    //background: rgba(0,0,0, 0.5);
    //padding: 5px;

    .actionButton{
      text-align: center;
      width: auto;
      height: auto;
      color: white;
      background: black;
      padding: 5px;
      pointer-events: all;
      cursor: pointer;
      margin-top: 3px;
      margin-bottom: 3px;
    }
  }

</style>

{#if visible}
<div class="actionMenu">
    <div class="actionInfo">
        <div class="buildingInfo">
            Place building <span id="buildingName"></span>
            <button type="button" on:click={handleCancel}>CANCEL</button>
        </div>
    </div>
</div>
{/if}
