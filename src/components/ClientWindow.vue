<template>
  <Draggable>
   <header>Connected Clients</header>
   <div class="content" v-if="opened">
    <select name="clients" size="2" v-model="selectedClient">
        <option v-for="(client,index) in clients" :value="index" :key="index">{{client.data.name}}</option>
  
    </select>
    <div v-if="clients[selectedClient]">
      <b>size:</b> {{clients[selectedClient].data.width}}x{{clients[selectedClient].data.width}}, {{clients[selectedClient].data.isFullScreen ? 'Fullscreen' : 'Not fullscreen'}}<br>
      <b>{{clients[selectedClient].data.media}}:</b> {{clients[selectedClient].data.loaded ? 'not loaded' : 'loaded' }}<br>
    </div>
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ClientWindow',
  data(){
    return {
      opened: true,
      selectedClient: 0
    };
  },
  props: {
    clients:Array
  },
  components:{
    Draggable
  }
}
</script>

<style scoped>
.window{
  grid-row: span 3;
}
</style>
