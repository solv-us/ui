<template>
  <Draggable>
   <header>Files</header>
   <div class="content" v-if="opened">
    <select name="files" multiple size="4">
        <option v-for="(file,index) in files" :key="index">{{file.name}}</option>
    </select>
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'FileWindow',
  data(){
    return {
      opened: true
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

</style>
