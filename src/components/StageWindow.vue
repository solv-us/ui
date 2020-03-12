<template>
   <Draggable>
    <header class="drag-handle">Stage #{{stage.id}} 
      <StatusLED></StatusLED>
    </header>
    <!-- <button  @click="opened = !opened">0</button> -->
    <div class="content" v-if="opened">
      <b>Media:</b>
       <select name="files" v-model="stage.media">
         <option v-for="(file,index) in files" :key="index">{{file.name}}</option>
       </select>
    </div>

    <button @click="$emit('sendStageEvent',stage.id,'start','timestamp')">start</button>
    
   </Draggable>
</template>

<script>
import Draggable from './Draggable.vue'
import StatusLED from './StatusLED.vue'

export default {
  name: 'StageWindow',
  data(){
    return {
      opened: true
    };
  },
  props: {
    stage: Object,
    files: Array
  },
  mounted() {

  },
  components:{
    Draggable,
    StatusLED
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
