<template>
  <Draggable :window="window" :defaultWidth="300" :defaultHeight="400">
   <template v-slot:header>
     Files  
  </template>
 <template v-slot:content>
    <input
          type="text"
          :value="publicPath"
          date-help="the media path"
        />
      <hr/>
    <select name="files" v-model="selectedFile" size="4">
        <option v-for="(file,index) in files" :value="index" :key="index">{{file.name}}</option>
    </select>

  </template>
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
    files:Array,
    publicPath:String,
    window:Object
  },
  components:{
    Draggable
  },
  mounted() {
  }
}
</script>

<style scoped>
select{
  height:100%;
}
input{
  margin-top:0;
}
</style>
