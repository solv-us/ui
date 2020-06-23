<template>
  <Window>
    <template v-slot:header>Welcome</template>
     <template v-slot:content>
      <div class="text-centered center">
      <div
        v-if="!connected"
        class="welcome"
      >
        <img src="@/assets/logo.svg" alt="Solvus Logo"/>
        <h1>solv.us <b>ui</b></h1>
        <p>Please connect to an active server to proceed.</p>
        <hr/>
        <b>Server URI</b>&nbsp;<br />
        <input
          type="text"
          :value="value"
          @input="$emit('input',$event.target.value)"
          class="text-centered"
        >
        <br /><br />

      </div>
      <div v-else style="width:300px">
        <p>There is no project running on this server. Open an existing project:</p>

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
        <button @click="$emit('createProject', newProjectName)" :disabled="createButtonDisabled">Create new project</button>

      </div>
      </div>
    </template>
  </Window>
</template>

<script>
import Window from "./Window.vue";

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
    Window
  },
  computed:{
    // Disable create button if no name is specified, or the name already exists
    createButtonDisabled(){
      return this.newProjectName.length < 1 || this.projects.includes(this.newProjectName+'.sproject');
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  font-weight: bold;
}
h1 b {
  font-weight: normal;
}
.window{
  width:400px;
  height:400px;
}
</style>
