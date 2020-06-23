<template>
  <div
    class="window"
  >
    <header>
      <slot name="header"></slot>
    </header>
    <div
     class="content"
      v-if="opened"
    >
      <slot name="content">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Window",
  data() {
    return {
      opened: true
    };
  },
};
</script>

<style scoped lang="scss">
.window {
  background: $primaryDisabled;
  border: 1px solid $primaryLight;
  color: #fff;
  width: fit-content;
  height: auto;
  touch-action: none;
  user-select: none;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: $borderRadius;
}
.window .content {
  font-size: 0.9em;
}
header {
  width: 100%;
  top: 0;
  left: 0;
  background: $primary;
  padding: $windowPadding;
  color: #fff;
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    width: auto;
  }
  button.icon {
    margin: -3px 0;
  }
}
.content {
  padding: $windowPadding;
  height: 100%;
  overflow: auto;
  border-top: 1px solid $primaryLight;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  color: #fff;
}

.grow{
  width:100%;
  height:auto;
}
</style>
