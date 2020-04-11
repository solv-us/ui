<template>
  <Draggable>
   <header>Files</header>
   <div class="content" v-if="opened">
    <select name="files" v-model="selectedFile" size="4">
        <option v-for="(file,index) in files" :value="index" :key="index">{{file.name}}</option>
    </select>
    {{files[selectedFile]}}
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'FileWindow',
  data(){
    return {
      opened: true,
      selectedFile:0
    };
  },
  props: {
    files:Array
  },
  components:{
    Draggable
  },
  mounted() {
  }
}
</script>

<style scoped>
.window{
  grid-row: span 3;
}
</style>
