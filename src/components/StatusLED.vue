<template>
  <div class="statusLED" :class="{ active: connected }"></div>
</template>

<script>
export default {
  name: 'StatusLED',
  props: {
    connected: Boolean
  }
}
</script>

<style scoped>
.statusLED{
  width:8px;
  height:8px;
  border-radius: 4px;
  background:#4f5468;
  position: relative;
  display: inline-block;
  margin:0 5px;
}
.active{
  background: #0ed600;
}
</style>
