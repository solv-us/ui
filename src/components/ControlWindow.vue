<template>
  <Draggable :class="editMode ? 'editing' : ''">
   <header @click="editMode = !editMode" >Stage Events</header>
   <div class="content" v-if="opened">
    
     <div v-for="(event, index) in events" :key="index">
        <button @click="$emit('stageEvent', event.to, event.code)" v-if="!editMode">
         {{event.name}}
        </button>
        <div v-else>
          <input type="text" v-model="event.name" />
          <input type="text" v-model="event.code" />
        </div>
     </div>

   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ControlWindow',
  data(){
    return {
      opened: true,
      editMode: false,
    };
  },
  props: {
    client: Object,
    events: Object
  },
  components:{
    Draggable
  },
  mounted() {
    console.log('yoiniy')
  }
}
</script>

<style scoped>
.window{
  grid-row: span 6;
}
.editing{
  grid-column: span 5;
}
input{
  width:50%;
}
</style>
