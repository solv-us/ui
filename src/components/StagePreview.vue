<template>
   <Draggable>
    <header>Stage Preview
        <input type="text" v-model="URL">
    </header>
    <iframe :src="'http://'+ serverURI + URL" allowfullscreen>
    </iframe>

   </Draggable>
</template>

<script>
import Draggable from './Draggable.vue'

export default {
  name: 'StagePreview',
  data(){
    return {
      URL: '/stage?id=preview'
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
  width:600px;
  height:400px;
}
iframe{
  border:none;
  width:100%;
  height:100%;
}
</style>
