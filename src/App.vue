<template>
  <div id="app">
    <Header
      :activeProjectName="activeProject.name"
      :publicPath="activeProject.publicPath"
      @closeProject="closeProject"
      @deleteProject="deleteProject"
      :serverURI="serverURI"
      :connected="connected"
      :drawerOpen="drawerOpen"
      @toggleDrawer="toggleDrawer"
      @disconnectFromServer="disconnectFromServer"
    ></Header>
    <div class="container">
      <WindowDrawer
        :drawer-open="drawerOpen&&projectOpen"
        :stages="stages"
      />
      <section
        class="workspace"
        :class="workspaceIsLocked ? 'locked' : ''"
        ref="workspace"
      >
        <div
          class="grid"
          ref="grid"
          v-if="projectOpen&&connected&&(activeProject.windows.length>0 || stages.length > 0)"
        >
          <!-- <StageWindow
            class="draggable"
            v-for="(stage,index) in stages"
            :key="'s'+index"
            :stage="stage"
            :clients="getClientsConnectedToStage(stage)"
            :files="files"
            @sendStageEvent="sendStageEvent"
          ></StageWindow> -->
          <template v-for="(window,index) in activeProject.windows">
            <ControlWindow
              v-if="window.type==='Control'"
              :window="window"
              @sendStageEvent="sendStageEvent"
              :key="index"
              :events="activeProject.events"
              :stages="stages"
              @updateEvents="updateEvents"
            ></ControlWindow>
            <ClientWindow
              v-if="window.type==='Client'"
              :window="window"
              :clients="clients"
              :key="index"
              :stages="activeProject.stages"
              @forceToStage="forceToStage"
            ></ClientWindow>
            <StageManagerWindow
              v-if="window.type==='Stages'"
              :window="window"
              :stages="stages"
              :key="index"
              :clients="clients"
              @sendStageEvent="sendStageEvent"
            ></StageManagerWindow>
            <FileWindow
              v-if="window.type==='File'"
              :window="window"
              :files="files"
              :key="index"
            ></FileWindow>
            <ClockWindow
              v-if="window.type==='Clock'"
              :window="window"
              :key="index"
            ></ClockWindow>
            <StagePreviewWindow
              v-if="window.type==='StagePreview'"
              :window="window"
              :serverURI="serverURI"
              :key="index"
            ></StagePreviewWindow>
          </template>
        </div>
        <div
          class="grid center full-size"
          v-else
        >
          <SetupWindow
            v-if="!projectOpen || !connected"
            v-model="serverURI"
            :connected="connected"
            @openProject="openProject"
            @createProject="createProject"
            :projects="projects"
          >
          </SetupWindow>
          <div
            v-else
            class="text-centered"
          >
            <h1><i class="material-icons md-48">widgets</i></h1>
            <p style="max-width:400px">This is your workspace. Press <span>D</span> to toggle the <i>Window Drawer</i>, and drag a window to the workspace to get started.</p>
          </div>
        </div>
        
        <div class="workspace-info">
          <button
            class="icon"
            data-help="(Un)lock your workspace from moving & resizing windows (L)"
            @click="workspaceIsLocked = !workspaceIsLocked"
          >{{ workspaceIsLocked ? 'lock_open' : 'lock'}}</button>
        </div>

      </section>
    </div>
  </div>
</template>

<script>
import interact from "interactjs";

import StageManagerWindow from "./components/StageManagerWindow.vue";
// import StageWindow from "./components/StageWindow.vue";
import StagePreviewWindow from "./components/StagePreviewWindow.vue";
import ControlWindow from "./components/ControlWindow.vue";
import FileWindow from "./components/FileWindow.vue";
import ClientWindow from "./components/ClientWindow.vue";
import ClockWindow from "./components/ClockWindow.vue";
import SetupWindow from "./components/SetupWindow.vue";

import WindowDrawer from "./WindowDrawer.vue";
import Header from "./components/Header.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    StageManagerWindow,
   // StageWindow,
    StagePreviewWindow,
    ControlWindow,
    FileWindow,
    ClientWindow,
    SetupWindow,
    ClockWindow,
    Header,
    WindowDrawer
  },
  data() {
    return {
      stages: [],
      files: [],
      clients: [],
      projects: [],
      activeProject: {
        publicPath:'',
        windows:[],
        events:[]
      },
      serverURI: "",
      connected: false,
      projectOpen: false,
      drawerOpen: false,
      workspaceIsLocked: true
    };
  },
  mounted() {
    //Check for remembered stuff
    let _serverURI = window.localStorage.getItem("serverURI");

    if (_serverURI) {
      this.serverURI = _serverURI;
    } else {
      this.serverURI =
        process.env.NODE_ENV === "development"
          ? window.location.hostname + ":8080"
          : window.location.host;
    }
    this.$socket = io.connect(this.serverURI + "/ui", {path:'/sockets'});
    this.socketListeners();

    this.initializeDropzone();
    window.addEventListener("keydown", this.handleKeyEvent, true);
  },
  methods: {
    // Handles keyboard events when not in input or textarea
    handleKeyEvent(event) {
      let exclude = ["input", "textarea"];
      if (exclude.indexOf(event.target.tagName.toLowerCase()) === -1) {
        switch (event.key) {
          case "d":
            this.toggleDrawer();
            break;
          case "l":
            this.workspaceIsLocked = !this.workspaceIsLocked;
            break;
        }
      }
      return;
    },
    updateEvents(){
      this.$socket.emit('updateEvents', this.activeProject.events);
    },
    addWindow(type, x, y) {
      this.activeProject.windows.push({ type, position: { x, y }, size:{width:null,height:null} });
      this.$socket.emit('updateWindows',this.activeProject.windows)
    },
    sendStageEvent(to, event, data ="") {
      console.log('stage event')
      this.$socket.emit("sendStageEvent", to, event, data);
    },
    openProject(projectName) {
      this.$socket.emit("openProject", projectName);
    },
    closeProject() {
      this.$socket.emit("closeProject");
    },
    deleteProject() {
      let areYouSure = prompt(
        " This action cannot be undone. This will permanently delete the '" +
          this.activeProject.name +
          "' project\n\n Please type '" +
          this.activeProject.name +
          "' to confirm:"
      );
      if (areYouSure === this.activeProject.name) {
        this.$socket.emit("deleteProject");
        this.resetActiveProject();
      } else if (areYouSure === null) {
        return;
      } else {
        this.deleteProject();
      }
    },
    createProject(projectName) {
      this.$socket.emit("createProject", projectName);
    },
    forceToStage(clientId,stageId){
      this.$socket.emit('forceToStage',clientId,stageId)
    },
    socketListeners() {
      this.$socket.on("projects", projects => {
        this.projects = projects;
      });
      this.$socket.on("projectUpdate", project => {
        if (project) {
          this.activeProject = project;
         this.stages = project.stages;
          //this.windows = project.windows;
          if (!this.projectOpen) this.projectOpen = true;
        } else {
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
    getClientsConnectedToStage(stage) {
      return this.clients.filter(x => x.data.stageId == stage.id);
    },
    initializeDropzone(){
       interact(this.$refs.workspace).dropzone({
        accept: ".drag-drop",
        overlap: 0.75,
        ondrop: event => { 
          this.drawerOpen = false;
          console.log(event.dragEvent)
          let type = event.relatedTarget.getAttribute("data-type");
          this.addWindow(
            type,
            event.dragEvent.clientX0,
            event.dragEvent.clientY0
          );
        }
      });

    },
    toggleDrawer(){
      this.drawerOpen = !this.drawerOpen;
    },
    disconnectFromServer(){
      this.serverURI = '';
      this.resetActiveProject();

    },
    resetActiveProject(){
      this.activeProject = { 
        windows:[],
        events:[]
      };
      this.clients = [];
      this.files = [];
    }
  },
  computed:{
    // See https://github.com/vuejs/vue/issues/2164
    activeProjectWatch(){
      return Object.assign({}, this.activeProject);
    }
  },
  watch: {
    stages: {
      handler(stages) {
        this.$socket.emit("updateStages", stages);
      },
      deep: true
    },
    serverURI() {
      window.localStorage.setItem("serverURI", this.serverURI);

      this.$socket.close();
      this.$socket = io.connect(this.serverURI + "/ui", {path:'/sockets'});
      this.socketListeners();
    },
    activeProjectWatch:{
      deep:true,
      handler(){
          this.$socket.emit('updateWindows', this.activeProject.windows)
      }
    }
  }
};
</script>

<style lang="scss">
body,
html,
#app,
.screen,
.container,
.workspace {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  overflow: hidden;
}

.container {
  display: flex;
}

.workspace {
  background: $primaryDark;
  overflow: scroll;
  scroll-behavior: smooth;
  &.locked {
    overflow: hidden;
  }
}
.workspace-info {
  position: absolute;
  top: 40px;
  right: 0;
  padding: $inputPadding;
}
.workspace>.grid {
  background-image: radial-gradient($primaryDisabled 1px, transparent 0);
  background-size: 20px 20px;
  background-position: -10px -10px;
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 60px);
  // grid-template-rows: repeat(auto-fill, 60px);
  grid-gap: 20px;
  padding: 20px;
  padding-top: 60px;
  width: 2000px;
  height: 2000px;
  position: relative;
}
.workspace>.grid.full-size{
  width:100%;
  height:100%;
}
</style>
