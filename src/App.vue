<template>
  <div id="app">
    <Header
      :serverURI="serverURI"
      :connected="connected"
    ></Header>
    <section class="workspace">
       <div
        class="grid"
        ref="grid"
        v-if="projectOpen"
      >
        <ControlWindow @start="sendStageEvent('*','start','timestamp')"></ControlWindow>
        <ClientWindow :clients="clients"></ClientWindow>
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
        <SetupWindow v-model="serverURI" :connected="connected" @openProject="openProject" :projects="projects">
        </SetupWindow>
      </div>
    </section>
  </div>
</template>

<script>
import StageWindow from "./components/StageWindow.vue";
import StagePreview from "./components/StagePreview.vue";
import ControlWindow from "./components/ControlWindow.vue";
// import FileWindow from './components/FileWindow.vue'
import ClientWindow from "./components/ClientWindow.vue";
import SetupWindow from "./components/SetupWindow.vue";
import Header from "./components/Header.vue";
import io from "socket.io-client";

let socket;

export default {
  name: "App",
  components: {
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
      serverURI: "",
      connected: false,
      projectOpen:false
    };
  },
  mounted() {
    // Get the Stage ?id= parameter from the url.
    let params = new URLSearchParams(document.location.search.substring(1));
    let serverURI = params.get("server");

    if (serverURI) {
      this.serverURI = "http://" + serverURI + ":8080";
    } else {
      this.serverURI =
        process.env.NODE_ENV === "development"
          ? window.location.hostname + ":8080"
          : window.location.host;
    }

    socket = io.connect(this.serverURI + "/ui");

    socket.on("projects", projects => {
      this.projects = projects;
    });
    socket.on("projectUpdate", project => {
      this.stages = project.stages;
    });
    socket.on("clientsUpdate", clients => {
      this.clients = clients;
    });
    socket.on("filesUpdate", files => {
      this.files = files;
    });

    socket.on("connect", () => {
      this.connected = true;
    });
    socket.on("disconnect", () => {
      this.connected = false;
    });
  },
  methods: {
    sendStageEvent(to, event, data = "") {
      console.log(event, to, data);
      socket.emit("stageEvent", to, event, data);
    },
    openProject(){
      this.projectOpen = true;
    }
  },
  watch: {
    stages: {
      handler(stages) {
        socket.emit("updateStages", stages);
      },
      deep: true
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
  grid-template-columns: repeat(auto-fill, 120px);
  grid-template-rows: repeat(auto-fill, 120px);
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
}
select option {
  border-bottom: 1px solid #262832;
  padding: 10px;
}
select[selected] {
  background: #262832;
}
</style>
