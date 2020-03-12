<template>
  <Draggable>
   <header>Welcome</header>
   <div class="content" v-if="opened">
     <div>
        <h1>solv.us <b>ui</b></h1>
        <p>To start working, please connect to an active server:</p>
        <input type="text">
        <StatusLED></StatusLED>
    </div>
   </div>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';
import StatusLED from './StatusLED'

export default {
  name: 'SetupWindow',
  data(){
    return {
      opened: true
    };
  },
  props: {
    client: Object
  },
  components:{
    Draggable,
    StatusLED
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
  font-weight: bold;
}
h1 b{
  font-weight: normal;
}
.window{
  width:400px;
  height:400px;
}
.content{
   display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}
</style>
