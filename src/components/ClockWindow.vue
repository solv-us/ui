<template>
  <Draggable :window="window" :defaultWidth="400" :defaultHeight="180">
   <template v-slot:header>
     Clock [{{ bpm }} BPM]
   </template>
  <template v-slot:content>
    <div class="flex-grid">
      <h1>{{time.bar}}:{{time.beat}}:{{time.division}}</h1>
      <div class="button-group pull-bottom">
        <button data-help="Decrease BPM" @click="bpm-=1">
          -
        </button>
        <button data-help="Increase BPM" @click="bpm+=1">
          +
        </button>
        <button data-help="Divide BPM by 2" @click="bpm=Math.round(bpm/2)">
          /2
        </button>
        <button data-help="Multiply BPM by 2" @click="bpm=Math.round(bpm*2)">
          *2
        </button>
        <!-- <button data-help="Temporarily increase">
          -|
        </button>
        <button data-help="Set BPM by tappinh">
          |-
        </button> -->
        <button data-help="Set the BPM by tapping this button in the rhythm of the music" @click="$emit('tapTempo')">
          TapTempo
        </button>
        <button data-help="Start Clock" @click="$emit('startMainClock')">
          Start
        </button>
        <button data-help="Stop Clock" @click="$emit('stopMainClock')">
          Stop
        </button>
      </div>
    </div>
   </template>
  </Draggable>
</template>

<script>
import Draggable from './Draggable.vue';

export default {
  name: 'ClockWindow',
  components:{
    Draggable
  },
  props:{
    window:Object,
    time:Object,
  },
  data(){
    return{
      bpm:120
    }
  },
  watch:{
    bpm(){
      this.$emit('setTempo', this.bpm)
    }
  }

}
</script>

<style scoped lang="scss">
.flex-grid{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;
  height: 100%;
}

h1{
  font-size:4em;
  font-weight: normal;
  margin: 10px 0;
  text-align: center;
}
</style>
