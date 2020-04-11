<template>
  <div class="window" ref="draggable">
    <slot></slot>
  </div>
</template>

<script>
import Draggable from './Draggable.vue'

export default {
  name: 'DraggableWindow',
  components:{
    Draggable
  }
}
</script>

<style scoped>
.window{
  width: 200px;
  background:$primaryLight;
  border:1px solid $primaryLight;
  color:#191A1E;
  margin-bottom:20px;
  height: max-content;
  touch-action: none;
  user-select: none;
  overflow: hidden;
}
header{
  width:100%;
  height:38px;
  top:0;
  left:0;
  background:$primary;
  padding: 10px;
  color:#fff;
  font-size:0.2em;
}
.content{
  padding:5px;
}
</style>
