<template>
  <div id="app">
    <Header
      :activeProjectName="activeProject.name"
      @closeProject="closeProject"
      :serverURI="serverURI"
      :connected="connected"
    ></Header>
    <div class="container">
    <WindowDrawer :drawer-open="drawerOpen" :stages="stages" />
    <section class="workspace" :class="workspaceIsLocked ? 'locked' : ''" ref="workspace">
       <div
        class="grid"
        ref="grid"
        v-if="projectOpen&&connected&&(windows.length>0 || stages.length > 0)"
      >
      <StageWindow
          class="draggable"
          v-for="(stage,index) in stages"
          :key="'s'+index"
          :stage="stage"
          :clients="getClientsConnectedToStage(stage)"
          :files="files"
          @sendStageEvent="sendStageEvent"
        ></StageWindow>
        <template v-for="(window,index) in windows">
          <StageWindow
            :window="window"
            class="draggable"
            v-if="window.type==='Stage'"
            :stage="stage"
            :clients="getClientsConnectedToStage(stage)"
            :files="files"
             @sendStageEvent="sendStageEvent"
            :key="index"
          ></StageWindow>
          <ControlWindow v-if="window.type==='Control'" :window="window" @start="sendStageEvent('*','start','timestamp')" v-model="events" :key="index"></ControlWindow>
          <ClientWindow v-if="window.type==='Client'"  :window="window" :clients="clients" :key="index"></ClientWindow>
          <StagesWindow v-if="window.type==='Stages'" :window="window" :stages="stages" :key="index"></StagesWindow>
          <FileWindow v-if="window.type==='File'" :window="window" :files="files" :key="index"></FileWindow>
          <StagePreviewWindow v-if="window.type==='StagePreview'" :window="window" :serverURI="serverURI" :key="index"></StagePreviewWindow> 
        </template>
      </div>
      <div
        class="center full-size"
        ref="grid"
        v-else
      >
        <SetupWindow v-if="!projectOpen" v-model="serverURI" :connected="connected" @openProject="openProject" @createProject="createProject"  :projects="projects">
        </SetupWindow>
        <div v-else class="text-centered">
          <h1><i class="material-icons md-48">widgets</i></h1>
          <p style="max-width:400px">This is your workspace. Press <span>D</span> to open the Drawer, and drag a window to the workspace to get started.</p>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<script>
import interact from 'interactjs'

import StagesWindow from "./components/StagesWindow.vue";
import StageWindow from "./components/StageWindow.vue";
import StagePreviewWindow from "./components/StagePreviewWindow.vue";
import ControlWindow from "./components/ControlWindow.vue";
import FileWindow from './components/FileWindow.vue'
import ClientWindow from "./components/ClientWindow.vue";
import SetupWindow from "./components/SetupWindow.vue";

import WindowDrawer from "./WindowDrawer.vue";
import Header from "./components/Header.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    StagesWindow,
    StageWindow,
    StagePreviewWindow,
    ControlWindow,
    FileWindow,
    ClientWindow,
    SetupWindow,
    Header,
    WindowDrawer
  },
  data() {
    return {
      stages: [],
      files: [],
      clients: [],
      projects:[],
      activeProject:{},
      serverURI: "",
      connected: false,
      projectOpen:false,
      drawerOpen:false,
      workspaceIsLocked:false
    };
  },
  mounted() {
    //Check for remembered stuff
    let serverURI = window.localStorage.getItem("serverURI");

    if (serverURI) {
      this.serverURI = serverURI;
    } else {
      this.serverURI =
        process.env.NODE_ENV === "development"
          ? window.location.hostname + ":8080"
          : window.location.host;
    }
    this.$socket = io.connect(this.serverURI + "/ui");
    this.socketListeners();

    interact(this.$refs.workspace).dropzone({
      accept: '.drag-drop',
      overlap: 0.75,
      ondrop: (event) => {
   
        this.drawerOpen = false;
        
        let type = event.relatedTarget.getAttribute('data-type');
        this.addWindow(type, event.dragEvent.client.x, event.dragEvent.client.y)
      
      }
    })

    window.addEventListener("keydown", this.handleKeyEvent, true);

  },
  methods: {
    // Handles keyboard events when not in input or textarea
    handleKeyEvent(event){
      let exclude = ['input', 'textarea'];
      if (exclude.indexOf(event.target.tagName.toLowerCase()) === -1) {
        switch(event.key){
        case 'd':
          this.drawerOpen = !this.drawerOpen;
        break;
        case 'l':
          this.workspaceIsLocked = !this.workspaceIsLocked;
        break;
      }
      }
      return;
    },
    addWindow(type, x, y){
        this.windows.push({type, position:{x,y}})
    },
    sendStageEvent(to, event, data = "") {
      this.$socket.emit("stageEvent", to, event, data);
    },
    openProject(projectName){
      this.$socket.emit('openProject', projectName)
    },
    closeProject(){
      this.$socket.emit('closeProject');
    },
    createProject(projectName){
      this.$socket.emit('createProject', projectName)
    },
    socketListeners(){

      this.$socket.on("projects", projects => {
        this.projects = projects;
      });
      this.$socket.on("projectUpdate", project => {
        if(project){
          this.activeProject = project;
          this.stages = project.stages;
          this.windows = project.windows;
          console.log(project)
          if(!this.projectOpen)
          this.projectOpen = true;
        }else{
          this.activeProject = {};
          this.stages = [];
          this.projectOpen = false;
          this.drawerOpen = false;
          this.windows = [];
          this.stages = [];
          this.files = [];
        }
      });
      this.$socket.on("clientsUpdate", clients => {
        this.clients = clients;
      });
      this.$socket.on("filesUpdate", files => {
        this.files = files;
      });

      this.$socket.on("connect", () => {
        this.connected = true;
      });
      this.$socket.on("disconnect", () => {
        this.connected = false;
      });

    },
    getClientsConnectedToStage(stage){
      return this.clients.filter(x => x.data.stageId == stage.id)
    }
  },
  watch: {
    stages: {
      handler(stages) {
        this.$socket.emit("updateStages", stages);
      },
      deep: true
    },
    windows: {
      handler(windows) {
        this.$socket.emit("updateWindows", windows);
      },
      deep: true
    },
    serverURI(){
      window.localStorage.setItem("serverURI", this.serverURI);

      this.$socket.close();
      this.$socket = io.connect(this.serverURI + "/ui");
      this.socketListeners();
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box!important;
}
body{
    font-family: "FiraCode-Retina", "Fira Code", monospace;
    font-size: 0.95em;
    color:#fff;
}
html,
body,
.screen,
#app,
.container,
.workspace{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
    overflow:hidden;
}

.container{
    display: flex;
}

.workspace{
  background: #191a1e;
  overflow:scroll;
  scroll-behavior: smooth;
}
.locked{
  overflow: hidden;
}
.grid {
  background-image: radial-gradient(#4f5468 1px, transparent 0);
    background-size: 20px 20px;
  background-position: -10px -10px;
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 60px);
  // grid-template-rows: repeat(auto-fill, 60px);
  grid-gap: 20px;
  padding:20px;
  padding-top:60px;
  width: 2000px;
  height: 2000px;
}
.full-size {
  width: 100%;
  height: 100%;
}
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-centered{
  text-align: center;;
}
button,
input,
select {
  width: 100%;
  padding: 5px;
  appearance: none;
  background: #191a1e;
  border: 1px solid #fff;
  color: #fff;
  font-weight: bold;
  transition: 0.2s background, 0.2s border-color, 0.2s color;
  margin: 2px 0;
  border-radius: 0;
}
button:hover {
  border: 1px solid #191a1e;
  background: #4f5468;
}
button.danger{
  border-color: red;
}
button.danger:hover{
  background:red;
}
input {
  width: auto;
  border: 1px solid #4f5468;
}
select {
  background: none;
  padding: 0;
}
select option {
  border-bottom: 1px solid #262832;
  padding: 10px;
   background: #262832;
}



select option:hover,
select option:focus,
select option:active {
background: linear-gradient(#4f5468,#4f5468);
background-color: #4f5468 !important; /* for IE */
color: #fff!important;
}

select option:checked, select option:focus:checked{
background: linear-gradient(#313440,#313440);
background-color:#050507!important; /* for IE */
color:#fff!important;
}

hr{
  border:none;
  border-bottom:1px solid #262832;
  background:none;
}

/* On Hover Help attribute */
[data-help]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.1s;
    visibility: visible;
}
[data-help]:after {
    content: attr(data-help);
    color: #fff;
    border:1px solid #4f5468;
    border-top: none;
    background:#262832;
    position: fixed;
    top:40px;
    right:0;
    width:200px;
    text-align: center;
    padding: 10px;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
    font-size:12px;
    font-weight: 300;
}
[data-help]:after:after{
  background-color: #4f5468;
}

/* Font Icons */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(assets/material-icons/MaterialIcons-Regular.woff2) format('woff2'),
    url(assets/material-icons/MaterialIcons-Regular.woff) format('woff'),
    url(assets/material-icons/MaterialIcons-Regular.ttf) format('truetype');
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
/* Rules for sizing the icon. */
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Rules for using icons as black on a light background. */
.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

/* Rules for using icons as white on a dark background. */
.material-icons.md-light { color: rgba(255, 255, 255, 1); }
.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }

</style>
