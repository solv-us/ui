<template>
  <Draggable>
   <header>Controls</header>
   <div class="content" v-if="opened">
     <button @click="$emit('start')">
       Start / Reset
     </button>
      <button @click="$emit('start')">
       Pause
     </button>
      <button @click="$emit('prep')">
      prep
     </button>
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ControlWindow',
  data(){
    return {
      opened: true
    };
  },
  props: {
    client: Object
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
</style>
