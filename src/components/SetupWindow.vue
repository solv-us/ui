<template>
  <Draggable>
    <header>Welcome</header>
    <div
      class="content text-centered"
      v-if="opened"
    >
      <div
        v-if="!connected"
        class="welcome"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 80 80"
        >
          <defs>
            <radialGradient
              cx="56.15%"
              cy="27.43%"
              fx="56.15%"
              fy="27.43%"
              r="57.526%"
              gradientTransform="matrix(.5626 -.82673 .8022 .54591 .026 .589)"
              id="ball-3-a"
            >
              <stop
                stop-color="#F8F7FF"
                offset="0%"
              ></stop>
              <stop
                stop-color="#DAD8FF"
                offset="34.827%"
              ></stop>
              <stop
                stop-color="#9B95F3"
                offset="100%"
              ></stop>
            </radialGradient>
            <filter
              x="-500%"
              y="-500%"
              width="1000%"
              height="1000%"
              filterUnits="objectBoundingBox"
              id="dropshadow-ball-3"
            >
              <feOffset
                dx="24"
                dy="24"
                in="SourceAlpha"
                result="shadowOffsetOuter"
              ></feOffset>
              <feGaussianBlur
                stdDeviation="24"
                in="shadowOffsetOuter"
                result="shadowBlurOuter"
              ></feGaussianBlur>
              <feColorMatrix
                values="0 0 0 0 0.10 0 0 0 0 0.17 0 0 0 0 0.21 0 0 0 0.22 0"
                in="shadowBlurOuter"
              ></feColorMatrix>
            </filter>
          </defs>
          <circle
            cx="40"
            cy="40"
            r="40"
            fill="#FFF"
            fill-rule="evenodd"
            style="filter:url(#dropshadow-ball-3)"
          ></circle>
          <circle
            cx="40"
            cy="40"
            r="40"
            fill="url(#ball-3-a)"
            fill-rule="evenodd"
          ></circle>
        </svg>
        <h1>solv.us <b>ui</b></h1>
        <p>Please connect to an active solv.us server.</p>
        <b>Server URI</b>&nbsp;<br />
        <input
          type="text"
          :value="value"
          @input="$emit('input',$event.target.value)"
        >
        <br /><br />

      </div>
      <div v-else style="width:300px">
        <p>There is no project running on this server yet. Open one:</p>

        <select
          name="projects"
          size="3"
          v-model="selectedProject"
        >
          <option
            v-for="(project,index) in projects"
            :value="project"
            :key="index"
          >{{project}}</option>
        </select>
        <button
          :disabled="!selectedProject"
          @click="$emit('openProject', selectedProject)"
        >Open {{projects[selectedProject]}}</button>
        <hr/>

        <p>Or, create a new project:</p>
        <input type="text" v-model="newProjectName" placeholder="Project name"/>
        <button @click="$emit('createProject', newProjectName)" :disabled="disabled">Create empty project</button>

      </div>
    </div>
  </Draggable>
</template>

<script>
import Draggable from "./Draggable.vue";

export default {
  name: "SetupWindow",
  data() {
    return {
      opened: true,
      selectedProject: '',
      newProjectName:'',

    };
  },
  props: ["value", "connected", "projects"],
  components: {
    Draggable
  },
  computed:{
    disabled(){
      return !this.newProjectName.length > 0;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: bold;
}
h1 b {
  font-weight: normal;
}
.window {
  width: 400px;
  height: 440px;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.welcome {
  padding: 50px;
}

input[type=text]{
  width:100%;
  padding:10px;
}
</style>
