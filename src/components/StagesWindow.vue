<template>
  <Draggable>
   <header>Stages</header>
   <div class="content" v-if="opened">
         <button @click="addStage">Add stage</button>
    <select name="stages" size="5" v-model="selectedStage">
        <option v-for="(stage,index) in stages" :value="index" :key="index">{{stage.id }}</option>
    </select>
    <div v-if="stages[selectedStage]">
    </div>
    <button @click="deleteStage">Delete stage</button>
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'stageWindow',
  data(){
    return {
      opened: true,
      selectedStage: 0
    };
  },
  props: {
    stages:Array
  },
  components:{
    Draggable
  },
  methods:{
    addStage(){
      this.stages.push({
          id: this.stages.length+1,
          media: ''
      })
    },
    deleteStage(){
      //let previousStage = this.selectedStage -1;
      this.stages.splice(this.selectedStage,1);
    }
  }
}
</script>

<style scoped>
.window{
  grid-row: span 6;
  grid-column: span 3;
}
</style>
