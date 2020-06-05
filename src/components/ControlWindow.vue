<template>
  <Draggable :class="editMode ? 'editing' : ''">
   <template v-slot:header>Stage Events
     <button class="icon" @click="editMode = !editMode" v-if="events.length>0" data-help="Toggle between edit & launch mode">
      {{editMode ? 'done' : 'create'}}
     </button>
   </template>
  <template v-slot:content>
    
     <div v-for="(event, index) in events" :key="index">
        <button @click="$emit('stageEvent', event.to, event.code)" v-if="!editMode">
         {{event.label}}
        </button>
        <div v-else class="input-group">
          <input type="text" v-model="event.label" />
          <input type="text" v-model="event.code" />
          <input type="text" v-model="event.to" />
        </div>
     </div>
     <div v-if="editMode && events.length > 0">
       <button @click="events.push({label:'', to:'',code:''})">+</button>
     </div>
      <div v-if="events.length < 1" class="center text-centered">
        <div>
          <i
            class="material-icons md-48"
          >router</i>
          <p>No Stage Events yet</p>
          <button @click="editMode=true;events.push({label:'Start all stages', to:'*',code:'start'})">Add a Stage Event</button>
        </div>
      </div>
   </template>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ControlWindow',
  data(){
    return {
      opened: true,
      editMode: false,
      events:[]
    };
  },
  props: {
    client: Object,
    // events: Object
  },
  components:{
    Draggable
  },
  mounted() {
    console.log('yoiniy')
  }
}
</script>

<style scoped class="scss">
.window{
  width:300px;
  height:200px;
}
.input-group input{
  width:33%;
  border-radius: 0;
}
.input-group:first-child{
  border-radius: $borderRadius 0;
}
.input-group:last-child{
  border-radius: 0 $borderRadius;
}
</style>
