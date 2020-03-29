<template>
    <header>
        <span @click="requestFullScreen">
          solvus <b>ui</b></span>
          
        <span style="display:inline-block;margin:0 auto;" @click="$emit('closeProject')">{{activeProjectName}}.sproject</span>

        <div style="float:right">
            <StatusLED :connected="connected"></StatusLED>
            <input disabled type="text" v-model="serverURI"/>
        </div>
    </header>
</template>

<script>
import StatusLED from './StatusLED.vue'

export default {
  name: 'Header',
  data(){
    return {
      screenX: 0,
      screenY: 0,
      opened: false
    };
  },
  props: {
    serverURI: String,
    connected: Boolean,
    activeProjectName: String
  },
  components:{
      StatusLED
  },
  methods:{
      requestFullScreen(){
        
        let elem = document.querySelector("body");

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
            
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header{
    width:100%;
    height:40px;
    color:#fff;
    background:#262832;
    border-bottom: 1px solid #4f5468;
    padding:10px;
    position: fixed;
    z-index: 1;
    display: flex;
}
</style>
