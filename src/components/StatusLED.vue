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

<style scoped lang="scss">
.statusLED{
  width:8px;
  height:8px;
  border-radius: 4px;
  background:$primaryLight;
  position: relative;
  display: inline-block;
  margin:0 5px;
}
.active{
  background: $success;
}
</style>
