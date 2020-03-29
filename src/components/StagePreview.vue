<template>
   <Draggable>
    <header>Stage Preview
        <input type="text" v-model="URL">
    </header>
    <iframe :src="serverURI + URL" allowfullscreen>
    </iframe>

   </Draggable>
</template>

<script>
import Draggable from './Draggable.vue'

export default {
  name: 'StagePreview',
  data(){
    return {
      URL: '/stage?id=2'
    };
  },
  props:{
    serverURI: String
  },
  components:{
    Draggable,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window{
  grid-column: span 8;
  grid-row: span 6;
}
iframe{
  border:none;
  width:100%;
  height:100%;
}
input{
  padding: 0;

}
</style>
