<template>
    <header>
        <span class="logo" @click="requestFullScreen" data-help="Click to toggle full-screen">
          solvus <b>ui</b></span>
          
        <span v-if="activeProjectName" class="project-name" @click="settingsOpened = !settingsOpened">{{activeProjectName}}.sproject        </span>
                  
          <div class="settings" :class="settingsOpened ? 'opened ' : ''">
            <div>
              <input type="text" v-model="activeProjectName"/>
                <input type="text" value="/Daan/Solvus/Projects"/>
              <button @click="settingsOpened = false;$emit('closeProject')" >Close project</button>
              <hr>
              <button class="danger" @click="settingsOpened = false;$emit('deleteProject')" >Delete project</button>
            </div>
          </div>

        
        <span class="end">
            <StatusLED :connected="connected"></StatusLED>
        </span>
    </header>
</template>

<script>
import StatusLED from './StatusLED.vue'

export default {
  name: 'Header',
  data(){
    return {
      settingsOpened:false
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
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
}

header span{
  flex: 1;
  display: flex;
  justify-content: center;
   align-items: center;
}
.logo{
 justify-content:flex-start;
}
.end{
  justify-content: flex-end;
}
header spanfirst-child > span { margin-right: auto; }

header span:last-child  > span { margin-left: auto;  }
/* .logo{
  justify-self:flex-start;
}
.end{
  justify-self: flex-end;
}
.project-name{
  align-self: center;
} */
.settings{
  position:absolute;
  display: block;
  top:50px;
  left:0;
  width:100%;
  display:flex;
  justify-content: center;
  max-height:0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.2s ease-in-out;
  pointer-events: none;
}
.settings input{
  width:100%;
  text-align: center;
}
.settings.opened{
  max-height:200px;
  opacity: 1;
}
.settings div{
  background:#262832;
  border: 1px solid #4f5468;
  padding:10px;
  border-radius: 10px;
  width:250px;
  pointer-events: all;
}
.settings div:after, .settings div:before {
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}

.settings div:after {
	border-color: rgba(0, 0, 0, 0);
	border-bottom-color: #262832;;
	border-width: 10px;
	margin-left: -10px;
}
.settings div:before {
	border-color: rgba(0, 0, 0, 0);
	border-bottom-color: #4f5468;;
	border-width: 6px;
	margin-left: -6px;
}
</style>
