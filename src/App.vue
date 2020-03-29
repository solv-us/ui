<template>
  <div id="app">
    <Header
      :activeProjectName="activeProject.name"
      @closeProject="closeProject"
      :serverURI="serverURI"
      :connected="connected"
    ></Header>
    <section class="workspace">
       <div
        class="grid"
        ref="grid"
        v-if="projectOpen&&connected"
      >
        <ControlWindow @start="sendStageEvent('*','start','timestamp')"></ControlWindow>
        <ClientWindow :clients="clients"></ClientWindow>
        <StagesWindow :stages="stages"></StagesWindow>
        <!-- <FileWindow :files="files"></FileWindow> -->
        <StagePreview :serverURI="serverURI"></StagePreview>

        <StageWindow
          class="draggable"
          v-for="(stage,index) in stages"
          :key="index"
          :stage="stage"
          :files="files"
          @sendStageEvent="sendStageEvent"
        ></StageWindow>
      </div>
      <div
        class="center full-size"
        ref="grid"
        v-else
      >
        <SetupWindow v-model="serverURI" :connected="connected" @openProject="openProject" @createProject="createProject"  :projects="projects">
        </SetupWindow>
      </div>
    </section>
  </div>
</template>

<script>
import StagesWindow from "./components/StagesWindow.vue";
import StageWindow from "./components/StageWindow.vue";

import StagePreview from "./components/StagePreview.vue";
import ControlWindow from "./components/ControlWindow.vue";
// import FileWindow from './components/FileWindow.vue'
import ClientWindow from "./components/ClientWindow.vue";
import SetupWindow from "./components/SetupWindow.vue";
import Header from "./components/Header.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    StagesWindow,
    StageWindow,
    StagePreview,
    ControlWindow,
    //  FileWindow,
    ClientWindow,
    SetupWindow,
    Header
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
      projectOpen:false
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
  },
  methods: {
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
          if(!this.projectOpen)
          this.projectOpen = true;
        }else{
          this.activeProject = {};
          this.stages = [];
          this.projectOpen = false;
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

    }
  },
  watch: {
    stages: {
      handler(stages) {
        this.$socket.emit("updateStages", stages);
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

<style>
* {
  box-sizing: border-box!important;
}
body{
    font-family: "FiraCode-Retina", "Fira Code", monospace;
    font-size: 0.95em;
}
html,
body,
.screen,
#app,
.grid,
.workspace{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
  grid-template-rows: repeat(auto-fill, 60px);
  grid-gap: 20px;
  padding:20px;
  padding-top: 60px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.workspace{
  background: #191a1e;
  background-image: radial-gradient(#262832 1px, transparent 0);
  background-size: 20px 20px;
  background-position: -10px -10px;
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
  padding: 10px 0;
  appearance: none;
  background: #191a1e;
  border: 1px solid #262832;
  color: #fff;
  font-weight: bold;
  transition: 0.2s background, 0.2s border-color;
  margin-bottom: 5px;
  border-radius: 0;
}
button:hover {
  border: 1px solid #191a1e;
  background: #4f5468;
  color: #191a1e;
}
input {
  width: auto;
  border: 1px solid #4f5468;
  padding: 5px;
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
</style>
