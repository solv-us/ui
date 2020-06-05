<template>
  <div id="app">
    <Header
      :activeProjectName="activeProject.name"
      @closeProject="closeProject"
      @deleteProject="deleteProject"
      :serverURI="serverURI"
      :connected="connected"
      :drawerOpen="drawerOpen"
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
            <ControlWindow
              v-if="window.type==='Control'"
              :window="window"
              @start="sendStageEvent('*','start','timestamp')"
              v-model="events"
              :key="index"
            ></ControlWindow>
            <ClientWindow
              v-if="window.type==='Client'"
              :window="window"
              :clients="clients"
              :key="index"
            ></ClientWindow>
            <StagesWindow
              v-if="window.type==='Stages'"
              :window="window"
              :stages="stages"
              :key="index"
            ></StagesWindow>
            <FileWindow
              v-if="window.type==='File'"
              :window="window"
              :files="files"
              :key="index"
            ></FileWindow>
            <StagePreviewWindow
              v-if="window.type==='StagePreview'"
              :window="window"
              :serverURI="serverURI"
              :key="index"
            ></StagePreviewWindow>
          </template>
        </div>
        <div
          class="center full-size grid"
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

import StagesWindow from "./components/StagesWindow.vue";
import StageWindow from "./components/StageWindow.vue";
import StagePreviewWindow from "./components/StagePreviewWindow.vue";
import ControlWindow from "./components/ControlWindow.vue";
import FileWindow from "./components/FileWindow.vue";
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
      projects: [],
      activeProject: {},
      serverURI: "",
      connected: false,
      projectOpen: false,
      drawerOpen: false,
      workspaceIsLocked: true
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
      accept: ".drag-drop",
      overlap: 0.75,
      ondrop: event => {
        this.drawerOpen = false;

        let type = event.relatedTarget.getAttribute("data-type");
        this.addWindow(
          type,
          event.dragEvent.client.x,
          event.dragEvent.client.y
        );
      }
    });

    window.addEventListener("keydown", this.handleKeyEvent, true);
  },
  methods: {
    // Handles keyboard events when not in input or textarea
    handleKeyEvent(event) {
      let exclude = ["input", "textarea"];
      if (exclude.indexOf(event.target.tagName.toLowerCase()) === -1) {
        switch (event.key) {
          case "d":
            this.drawerOpen = !this.drawerOpen;
            break;
          case "l":
            this.workspaceIsLocked = !this.workspaceIsLocked;
            break;
        }
      }
      return;
    },
    addWindow(type, x, y) {
      this.activeProject.windows.push({ type, position: { x, y } });
    },
    sendStageEvent(to, event, data = "") {
      this.$socket.emit("stageEvent", to, event, data);
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
      } else if (areYouSure === null) {
        return;
      } else {
        this.deleteProject();
      }
    },
    createProject(projectName) {
      this.$socket.emit("createProject", projectName);
    },
    socketListeners() {
      this.$socket.on("projects", projects => {
        this.projects = projects;
      });
      this.$socket.on("projectUpdate", project => {
        if (project) {
          this.activeProject = project;
          this.stages = project.stages;
          this.windows = project.windows;
          console.log(project);
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
    serverURI() {
      window.localStorage.setItem("serverURI", this.serverURI);

      this.$socket.close();
      this.$socket = io.connect(this.serverURI + "/ui");
      this.socketListeners();
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
.grid {
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
  position: lll;
}
</style>
