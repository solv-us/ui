<template>
   <Draggable :window="window" :defaultWidth="580" :defaultHeight="360">
    <template v-slot:header>Stage Preview
        <input type="text" v-model="URL">
    </template>

    <template v-slot:content>
      <iframe :src="URL" allowfullscreen scrolling="no">
      </iframe>
    </template>d
   </Draggable>
</template>

<script>
import Draggable from './Draggable.vue'

export default {
  name: 'StagePreviewWindow',
  data(){
    return {
      URL: 'https://localhost:8843/stage/examples/basic.html'
    };
  },
  props:{
    serverURI: String,
    window:Object
  },
  components:{
    Draggable,
  }
}
</script>

<style scoped lang="scss">
.window.content{
  padding:0!important;
}
iframe{
  border:none;
  width:100%;
  height:100%;
}
input{
  margin: 0;
  width:100%;
}
header{padding:0;}
</style>
