<template>
   <Window>
    <template v-slot:header>Stage #{{stage.id}} ({{ clientsReady }}/{{ clients.length }})
      <StatusLED :connected="clientsReady > 0" data-help="This light turns green when at least 1 connected client is ready for perfomance"></StatusLED>
    </template>

    <template v-slot:content>
      
       
         <!-- <span>Media:</span><select name="files" v-model="stage.media">
         <option v-for="(file,index) in files" :key="index">{{file.name}}</option>
       </select>
      <hr/> -->
      <button @click="$emit('sendStageEvent',stage.id,'toggleStandby','')" :data-help="'Send the \'toggleStandby\' event to Stage #'+stage.id">Toggle Standby Screen</button>
      <hr/>
      <button @click="$emit('sendStageEvent',stage.id,'start','timestamp')" :data-help="'Send the \'start\' event to Stage #'+stage.id">Start</button> 
      <button @click="$emit('sendStageEvent',stage.id,'stop','timestamp')" :data-help="'Send the \'stop\' event to Stage #'+stage.id">Stop</button> 
    </template>

   </Window>
</template>

<script>
import Window from './Window.vue'
import StatusLED from './StatusLED.vue'

export default {
  name: 'Stage',
  data(){
    return {
      opened: false
    };
  },
  props: {
    stage: Object,
    files: Array,
    clients:Array,
    window: Object
  },
  computed:{
    clientsReady(){
      return this.clients.filter(x => x.data.loaded).length
    }
  },
  components:{
    Window,
    StatusLED
  }
}
</script>