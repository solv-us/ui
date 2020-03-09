<template>
   <Draggable>
    <header class="drag-handle">Stage #{{stage.id}} 
      <StatusLED></StatusLED>
    </header>
    <!-- <button  @click="opened = !opened">0</button> -->
    <div class="content" v-if="opened">
      Size: {{stage.width}}x{{stage.height}}<br>
      {{stage.fileName}}<br>
      <b>Media:</b>
       <select name="files">
         <option v-for="(file,index) in files" :key="index">{{file.name}}</option>
       </select>
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
