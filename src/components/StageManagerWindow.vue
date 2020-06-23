<template>
  <Draggable :window="window" :defaultWidth="300" :defaultHeight="400">
   <template v-slot:header>Stage Manager
   </template>
    <template v-slot:content>
      <div class="grid">
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
         <Stage
          class="grow"
          :stage="stages[selectedStage]"
          :clients="clients"
          @sendStageEvent="sendStageEvent"
        ></Stage>
      </div>
      </div>
    </template>
  </Draggable>
</template>

<script>
import Draggable from "./Draggable.vue";
import Stage from "./Stage.vue"

export default {
  name: "StageManagerWindow",
  data() {
    return {
      opened: true,
      selectedStage: 0
    };
  },
  props: {
    stages: Array,
    window:Object,
    clients:Array
  },
  components: {
    Draggable,
    Stage
  },
  methods: {
    addStage() {
      let id = 'main'
      if(this.stages.length>0){
          id = this.stages.length + 1
      }
      this.stages.push({
        id,
        media: ""
      });
    },
    deleteStage() {
      //let previousStage = this.selectedStage -1;
      this.stages.splice(this.selectedStage, 1);
    },
    sendStageEvent(to, event, data ="") {
      this.$emit("sendStageEvent", to, event, data);
    }
  }
};
</script>

<style scoped lang="scss">
button{
    padding:4px;
}
.grid{
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr; 
  grid-gap: $inputPadding;
}
.grid,.grid>div{
  height:100%;
}
.grid>div:first-child select{
  flex:1;
  margin-top:5px;
}
.grid>div:first-child{
  max-width:400px;
  display: flex;
  flex:1;
  flex-direction: column;
}

</style>
