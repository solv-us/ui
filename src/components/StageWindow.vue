<template>
   <Draggable>
    <header @click="opened = !opened">Stage #{{stage.id}} ({{ clientsReady }}/{{ clients.length }})
      <StatusLED :connected="clientsReady > 0"></StatusLED>
    </header>

    <div class="content" v-if="opened">
      <b>Media:</b>
       <select name="files" v-model="stage.media">
         <option v-for="(file,index) in files" :key="index">{{file.name}}</option>
       </select>
      <button @click="$emit('sendStageEvent',stage.id,'start','timestamp')" :data-help="'Send the \'start\' event to Stage #'+stage.id">start</button>

    </div>
   </Draggable>
</template>

<script>
import Draggable from './Draggable.vue'
import StatusLED from './StatusLED.vue'

export default {
  name: 'StageWindow',
  data(){
    return {
      opened: false
    };
  },
  props: {
    stage: Object,
    files: Array,
    clients:Array
  },
  computed:{
    clientsReady(){
      return this.clients.filter(x => x.data.loaded).length
    }
  },
  components:{
    Draggable,
    StatusLED
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window{
  grid-column: span 3;
  width:220px;
  height:auto;
}
</style>
