<template>
  <Draggable :window="window" :defaultWidth="800" :defaultHeight="400" :class="learnMode ? 'editing' : ''">

   <template v-slot:header>MIDI Mapper [WIP]
      <button style="max-width:50px;" class="danger" :class="learnMode? 'active':''" @click="learnMode = !learnMode" v-if="mappings.length>0" data-help="Listen for MIDI mappings to use for mapping">
          learn
      </button>
    </template>
    <template v-slot:content>
      <div class="input-group" v-if="mappings.length>0">
       <b>MIDI Channel</b>
       <b>MIDI Number</b>
       <b>Event type</b>
       <b>Event ID</b>
       <b>Event target</b>
     </div>

     <div v-for="(mapping, index) in mappings" :key="index">
        <div class="input-group">
          <select v-model="mapping.channel" data-help="The MIDI channel to listen on">
            <option value="*">all</option>
            <option v-for="n in 10" :key="n" :value="n">{{n}}</option>
          </select>
          <select v-model="mapping.number" data-help="The MIDI number to listen for (Note number, PC number, CC number)">
            <option value="*">all</option>
            <option v-for="n in 255" :key="n" :value="n">{{n}}</option>
          </select>
          <select v-model="mapping.event.type" data-help="The event type">
             <option v-for="(type,index) in eventTypes" :key="index" :value="type">{{type}}</option>
          </select>

          <input type="text" v-model="mapping.event.id" placeholder="id" data-help="The event ID sent to the client" />
          <select :disabled="mapping.event.type=='system'" v-model="mapping.event.target" data-help="The target stage">
            <option value="*">all</option>
            <option v-for="(stage,index) in stages" :key="index" :value="stage.id">#{{stage.id}}</option>
          </select>

        </div>
     </div>

     <div v-if="learnMode && mappings.length > 0">
       <button @click="mappings.push({label:'', id:'', target:'*'})">+</button>
     </div>
      <div v-if="mappings.length < 1" class="center text-centered">
        <div>
          <i
            class="material-icons md-48"
          >usb</i>
          <p>MIDI mappings let you send stage and system events with external hardware</p>
          <button @click="addMapping()">Add a MIDI Mapping</button>
        </div>
      </div>
   </template>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'MIDIMapper',
  data(){
    return {
      opened: true,
      learnMode: false,
      messageTypes:['noteon', 'noteoff', 'cc', 'program','*'],
      eventTypes:['stage','system']
    };
  },
  methods:{
    addMapping(){
      let mapping = {
          deviceName: '*',
          channel: '*',
          number: '*',
          type: '*',
          event:  {
              type: 'stage',
              target: '*',
              id: ''
          }
      }

      this.mappings.push(mapping);
    }
  },
  props: {
    window: Object,
    mappings:Array,
    stages:Array
  },
  components:{
    Draggable
  },
  watch:{
    learnMode(){
      if(this.learnMode ===false && this.mappings.length !==0){
        this.$emit('updateMidiMappings', this.mappings);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.input-group{
  display: flex;
}
.input-group input,.input-group select{
  height:30px;
  border-radius: 0;
  min-width: 0;
  flex-grow: 1;
}
 .input-group b{
   min-width: max-content;
   flex-grow:1;
   font-weight: normal;
 }

</style>
