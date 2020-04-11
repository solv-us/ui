<template>
  <aside
    class="window-drawer"
    :class="drawerOpen ? 'open' : ''"
  >
  <button @click="addStage">Add a stage</button>
  <hr>
  <p>Drag a window to the workspace to instantiate it</p>
    <button class="drag-drop" data-type="Control">Controls</button>
    <button class="drag-drop" data-type="Client" data-help="List of connected clients">Clients</button>
    <button class="drag-drop" data-type="Stages" data-help="The Stage Manager">Stages</button>
    <!-- <button class="drag-drop" data-type="Stage">Stage</button> -->
    <button class="drag-drop" data-type="StagePreview" data-help="A preview of the stage">Stage Preview</button>
     <button class="drag-drop" data-type="File" data-help="A File Browser">File</button>
  </aside>
</template>

<script>
import interact from "interactjs";

export default {
  name: "WindowDrawer",
  data() {
    return {
      screenX: 0,
      screenY: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      interact(".drag-drop")
        .draggable({
          inertia: false,
          autoScroll: false
        })
        .on("dragmove", event => {
          this.screenX += event.dx;
          this.screenY += event.dy;

          event.target.style.webkitTransform = event.target.style.transform =
            "translate(" + this.screenX + "px, " + this.screenY + "px)";
        })
        .on("dragend", event => {
          event.target.style.transform = "";
          this.screenX = 0;
          this.screenY = 0;
        });
    });
  },
  props: ["drawer-open","stages"],
   methods: {
    addStage() {
      this.stages.push({
        id: this.stages.length + 1,
        media: ""
      });
    },
    deleteStage() {
      //let previousStage = this.selectedStage -1;
      this.stages.splice(this.selectedStage, 1);
    }
  }
};
</script>

<style scoped lang="scss">
.window-drawer {
  height: 100%;
  width: 240px;
  margin-top: 40px;
  margin-left: -240px;
  padding:20px;
  background: #4f5468;
  border-right:1px solid #262832;
  z-index: 1;
  top: 0;
  left: 0;
  padding-top: 20px;
  transition: margin-left 0.1s;
  &.open {
    margin-left: 0;
  }
}
p{
  color:#fff;
  text-align: center;
  font-size: 0.7em;
  margin:10px 0;
}
</style>
