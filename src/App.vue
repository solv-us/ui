<template>
  <div id="app">
    <Header :serverURI="serverURI" :connected="connected"></Header>

    <div class="grid" ref="grid">

      <!-- <div v-if="connected"> -->
        <ControlWindow @start="sendStageEvent('*','start','timestamp')"></ControlWindow>
        <StageWindow class="draggable" v-for="(stage,index) in stages" :key="index" :stage="stage" :files="files"
        @sendStageEvent="sendStageEvent"
        ></StageWindow>
        <ClientWindow :clients="clients"></ClientWindow>
        <FileWindow :files="files"></FileWindow>
        <StagePreview :serverURI="serverURI" ></StagePreview>
<!-- 
      </div>

      <setup-window v-else></setup-window> -->
    </div>
  </div>
</template>

<script>
import StageWindow from './components/StageWindow.vue'
import StagePreview from './components/StagePreview.vue'
import ControlWindow from './components/ControlWindow.vue'
import FileWindow from './components/FileWindow.vue'
import ClientWindow from './components/ClientWindow.vue'
// import SetupWindow from './components/SetupWindow.vue'
import Header from './components/Header.vue'
import io from "socket.io-client";

let socket;

export default {
  name: 'App',
  components: {
   StageWindow,
   StagePreview,
   ControlWindow,
   FileWindow,
   ClientWindow,
  //  SetupWindow,
   Header
  },
  data(){
    return{
     stages:[],
     files:[],
     clients:[],
     serverURI:'',
     connected:false
    }
  },
  mounted(){
    this.serverURI =
      process.env.NODE_ENV === "development"
        ? window.location.hostname + ":8080"
        : window.location.host;

    socket = io.connect(this.serverURI+'/ui');

    socket.on('projectUpdate',(project)=>{
      this.stages = project.stages;
    });
    socket.on('clientsUpdate', (clients)=>{
      this.clients = clients;
    });
    socket.on('filesUpdate', (files)=>{
      this.files = files;
    });


    socket.on('connect',()=>{
      this.connected = true;
    })
    socket.on('disconnect',()=>{
      this.connected = false;
    });

  },
  methods:{
    sendStageEvent(to, event, data = ''){
      console.log(event,to,data)
      socket.emit('stageEvent', to, event, data)
    }
  },
  watch: {
    stages: {
     handler(stages){
       socket.emit('updateStages', stages)
     },
     deep: true
  }
}
}
</script>

<style>
*{
  box-sizing: border-box;
}
html,body,.screen,#app,.grid{
    font-family:'FiraCode-Retina','Fira Code', monospace;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top:0;
    left:0;
    background: #191A1E;
    font-size: 0.95em;
}
.grid{
    background-image: radial-gradient(#262832 1px, transparent 0);
    background-size: 20px 20px;
    background-position:-10px -10px;
    padding:20px 0 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 240px);
    grid-template-rows:repeat(auto-fill, 240px);
    grid-gap: 20px;
    margin-top:40px;
    position: absolute;

    width:100%;
    height:100%;
}

button, input,select{
  width:100%;
  padding:10px 0;
  appearance: none;
  background:#191A1E;
  border:1px solid #262832;
  color:#fff;
  font-weight: bold;
  transition: 0.2s background, 0.2s border-color;
  margin-bottom: 5px;
  border-radius: 0;
}
button:hover{
  border:1px solid #191A1E;
  background:#4f5468;
  color:#191A1E;
}
input{
  width:auto;
  border:1px solid #4f5468;
  padding: 5px;
}
select{
    background: none;
}
select option{
  border-bottom: 1px solid  #262832;
  padding: 10px;
}
select[selected] {
  background:#262832;
}
</style>
