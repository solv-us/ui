<template>
  <Draggable :window="window" :defaultWidth="400" :defaultHeight="400" :class="editMode ? 'editing' : ''">
   <template v-slot:header>Stage Events
     <button class="icon" @click="editMode = !editMode" v-if="events.length>0" data-help="Toggle between edit & launch mode">
      {{editMode ? 'done' : 'create'}}
     </button>
   </template>
  <template v-slot:content>
    
     <div v-for="(event, index) in events" :key="index">
        <button @click="$emit('sendStageEvent', event.target, event.id)" v-if="!editMode">
         {{event.label}}
        </button>
        <div v-else class="input-group">
          <input type="text" v-model="event.label" placeholder="label" data-help="The label for this event" />
          <input type="hidden" v-model="event.type" value="stage"/>
          <input type="text" v-model="event.id" placeholder="id" data-help="The event ID sent to the client" />
          <input type="text" v-model="event.data" placeholder="value" data-help="Optional: a value to send with the event" />
          <select v-model="event.target" data-help="The target stage">
            <option value="*">all</option>
            <option v-for="(stage,index) in stages" :key="index" :value="stage.id">#{{stage.id}}</option>
          </select>
        </div>
     </div>

     <div v-if="editMode && events.length > 0">
       <button @click="events.push({label:'', id:'', target:'*'})">+</button>
     </div>
      <div v-if="events.length < 1" class="center text-centered">
        <div>
          <i
            class="material-icons md-48"
          >router</i>
          <p>Stage Events are commands send to stages, to which your code can react.</p>
          <button @click="editMode=true;events.push({label:'', id:'', target:'*'})">Add a Stage Event</button>
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
    };
  },
  props: {
    window: Object,
    events:Array,
    stages:Array
  },
  components:{
    Draggable
  },
  watch:{
    editMode(){
      if(this.editMode ===false && this.events.length !==0){
        this.$emit('updateEvents', this.events);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input-group{
  display: flex;
}
.input-group input,.input-group select{
  height:30px;
  flex-shrink: 1;
  border-radius: 0;
  min-width: 0;
}
.input-group input:first-child{
  border-radius: $borderRadius 0 0 $borderRadius !important;
  border-right:none;
}
.input-group input:last-child, .input-group select:last-child{
  border-left:none;
  border-radius: 0 $borderRadius $borderRadius 0!important;
}
</style>
