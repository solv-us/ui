<template>
  <Draggable>
    <header>Stages</header>
    <div
      class="content"
      v-if="opened"
    >
      <div>
        <div class="button-group">
          <button
            @click="addStage"
            data-help="Add a stage to your installation"
          ><i class="material-icons">add</i></button>
          <button
            @click="deleteStage"
            data-help="Delete the currently selected stage"
          ><i class="material-icons">delete</i></button>
        </div>
        <select
          name="stages"
          size="5"
          v-model="selectedStage"
        >
          <option
            v-for="(stage,index) in stages"
            :value="index"
            :key="index"
          >#{{stage.id }}</option>
        </select>
      </div>
      <div v-if="stages[selectedStage]">
         <StageWindow
          class="draggable"
          :stage="stages[selectedStage]"
        ></StageWindow>
      </div>
    </div>
  </Draggable>
</template>

<script>
import Draggable from "./Draggable.vue";
import StageWindow from "./StageWindow.vue"

export default {
  name: "stageWindow",
  data() {
    return {
      opened: true,
      selectedStage: 0
    };
  },
  props: {
    stages: Array
  },
  components: {
    Draggable,
    StageWindow
  },
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

<style scoped>
.window {
  grid-row: span 5;
  grid-column: span 6;
}
.content {
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-template-rows: 1fr;
  grid-gap: 10px;
}
select{
  height: 100%;
}
.button-group{
  display:flex;
}
button{
    padding:4px;
}
</style>
