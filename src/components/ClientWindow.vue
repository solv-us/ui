<template>
  <Draggable>
   <header>Clients</header>
   <div class="content" v-if="opened">
    <select name="clients" size="2" v-model="selectedClient">
        <option v-for="(client,index) in clients" :value="index" :key="index">{{client.data.name}}</option>
    </select>
    <div v-if="clients[selectedClient]">
      {{clients[selectedClient].data }}
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
  },
  mounted() {
  }
}
</script>

<style scoped>
.content{
  height:500px;
}
</style>
