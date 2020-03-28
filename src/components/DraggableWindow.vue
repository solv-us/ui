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
  background:#4f5468;
  border:1px solid #4f5468;
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
  background:#262832;
  padding: 10px;
  color:#fff;
  font-size:0.2em;
}
.content{
  padding:5px;
}
</style>
