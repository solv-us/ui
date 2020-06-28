<template>
  <div>
    <header>
      <span class="logo">
        <button
          @click="$emit('toggleDrawer')"
          :disabled="!activeProjectName"
          data-help="Click toggle Window Drawer (D)"
          class="icon"
        >{{ drawerOpen ? 'keyboard_arrow_left' : 'keyboard_arrow_right' }}</button>
        <button
          @click="requestFullScreen"
          data-help="Click to toggle Full-Screen"
          class="icon"
        >{{ isFullScreen ? 'fullscreen_exit' : 'fullscreen' }}</button>
      </span>

      <span
        v-if="activeProjectName"
        class="project-name"
        @click="settingsOpened = !settingsOpened"
      >
        <i class="material-icons">{{ settingsOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</i>
        {{ activeProjectName + '.sproject' }}
      </span>
      <span v-else>
        solvus&nbsp;<b>ui</b>
      </span>


      <span class="end">
        <StatusLED :connected="connected"></StatusLED>
      </span>
    </header>
    <div
      class="settings"
      :class="settingsOpened ? 'opened ' : ''"
    >
      <div>
        <input
          type="text"
          v-model="activeProjectName"
        />
        <input
          type="text"
          :value="publicPath"
          date-help="the media path"
        />
        <button @click="settingsOpened = false;$emit('closeProject')">Close project</button>
        <button
          class="danger"
          @click="settingsOpened = false;$emit('deleteProject')"
        >Delete project</button>
        <hr>
        <input type="text" readonly :value="serverURI"  @focus="$event.target.select()" date-help="The URI of the server"/>
        <button @click="disconnectFromServer" 
          date-help="Disconnect from server"
        >Disconnect from server</button>
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from "screenfull"
import StatusLED from "./StatusLED.vue";

export default {
  name: "Header",
  data() {
    return {
      settingsOpened: false,
      isFullScreen: false
    };
  },
  props: {
    serverURI: String,
    connected: Boolean,
    activeProjectName: String,
    drawerOpen: Boolean,
    publicPath:String
  },
  components: {
    StatusLED
  },
  methods: {
    requestFullScreen() {
        let element = document.querySelector("body");
        if (screenfull.isEnabled) {
            screenfull.toggle(element);
           this.isFullScreen = !this.isFullScreen;
        }
    },
    disconnectFromServer(){
      this.settingsOpened = false;
      this.$emit('disconnectFromServer');
    }
  }
};
</script>

<style scoped lang="scss">
header {
  width: 100%;
  height: 40px;
  color: #fff;
  background: $primary;
  border-bottom: 1px solid $primaryLight;
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
}

header span {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  justify-content: flex-start;
}
.end {
  justify-content: flex-end;
}
header spanfirst-child > span {
  margin-right: auto;
}

header span:last-child > span {
  margin-left: auto;
}


.settings {
  position: absolute;
  display: block;
  left: 0;
  top: -400px;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: top 0.1s ease-in-out;
  pointer-events: none;
  z-index: 1;
  &.opened {
    top: 55px;
  }
}
.settings div {
  background: $primary;
  border: 1px solid $primaryLight;
  padding: $windowPadding;
  border-radius: $borderRadius;
  width: 250px;
  pointer-events: all;
  position: relative;
  @include arrow("top", "center", 10px, $primary, $primaryLight, 1px);
}

.settings input {
  width: 100%;
  text-align: center;
}
</style>
