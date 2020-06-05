<template>
   <Draggable>
    <template v-slot:header>Stage Preview
        <input type="text" v-model="URL">
    </template>

    <template v-slot:content>
      <iframe :src="serverURI + URL" allowfullscreen scrolling="no">
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
      URL: '/stage?id=1'
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

<style scoped lang="scss">
.window{
width:580px;
height:360px;
}
.window.content{
  padding:0!important;
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
