<template>
  <Draggable :window="window" :defaultWidth="240" :defaultHeight="300">
  <template v-slot:header>Connected Clients</template>
   <template v-slot:content>
    <div class="grid">

      <select name="clients" size="5" v-model="selectedClientKey">
          <option v-for="(client,index) in clients" :value="index" :key="index">{{client.id }}</option>
      </select>

      <div class="client-info" v-if="selectedClient">

       <select name="files" v-model="selectedClient.data.stageId"  @change="$emit('forceToStage',selectedClient.id, selectedClient.data.stageId)">
         <option v-for="(stage,index) in stages" :key="index" :value="stage.id">Stage #{{stage.id}}</option>
       </select>

        <hr/>
        <b>Size:</b> {{selectedClient.data.width}}x{{selectedClient.data.height}}<br>
        <b>Fullscreen:</b> {{selectedClient.data.isFullScreen ? 'Yes' : 'No'}}<br>

        <hr/>

      </div>
    </div>
   </template>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ClientWindow',
  data(){
    return {
      opened: true,
      selectedClientKey: 0,
      forceToStage:''
    };
  },
  computed:{
    selectedClient(){
      return this.clients[this.selectedClientKey];
    }
  },
  mounted(){
    // if(this.clients.length>0){
    //   this.selectedClient = 0;
    // }
  },
  props: {
    clients:Array,
    stages:Array,
    window:Object
  },
  components:{
    Draggable
  }
}
</script>

<style scoped lang="scss">
.grid{
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr; 
  grid-gap: $inputPadding;
}
.grid,.grid>div{
  height:100%;
}
.grid select{
  flex:1;
  min-width: 100px;
}
.client-info{
  margin: $inputPadding;
}
</style>
