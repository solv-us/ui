<template>
  <div
    class="window"
    ref="draggable"
    :style="style"
  >
    <header>
      <slot name="header"></slot>
    </header>
    <div
     class="content slo"
      v-if="opened"
    >
      <slot name="content">
      </slot>
    </div>
  </div>
</template>

<script>
import interact from "interactjs";

export default {
  name: "Draggable",
  data() {
    return {
      position: {
        x: 0,
        y: 0
      },
      size: {
        width: 100,
        height: 100
      },
      opened: true
    };
  },
  props: ["width", "height", "x", "y"],
  mounted() {

    // Set start size and position from props
    if(this.x && this.y){
      this.position.x = this.x;
      this.position.y = this.y;
    }
    if(this.width && this.height){
      this.size.width = this.width;
      this.size.height = this.height;
    }

    let myDraggable = this.$refs.draggable;

    interact(myDraggable)
      .draggable({
        allowFrom: "header",
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.createSnapGrid({ x: 20, y: 20 })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          }),
          interact.modifiers.restrict({
            restriction: myDraggable.parentNode,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            endOnly: true
          })
        ],
        inertia: false,
        autoScroll: false
      })
      .resizable({
        edges: {
          left: false,
          right: true,
          bottom: true,
          top: false
        },
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.createSnapGrid({ x: 20, y: 20 })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          })
        ]
      })
      .on("dragmove", event => {
        this.position.x += event.dx;
        this.position.y += event.dy;
        this.$emit('updateWindow', {
          position:this.position
        })
        // event.target.style.webkitTransform =
        // event.target.style.transform =
        //     'translate(' + this.position.x + 'px, ' + this.position.y + 'px)'
        // event.target.style.top = this.position.y + 'px';
        //  event.target.style.left = this.position.x + 'px';

        // event.target.style.gridArea = Math.round(this.position.y / 60) +'/'+Math.round(this.position.x / 60) +'/'+  'span ' + Math.round(this.size.height / 60) +'/'+'span ' + Math.round(this.size.width / 60);
      })
      .on("resizemove", event => {
        this.size.width = event.rect.width;
        this.size.height = event.rect.height;
        // event.target.style.gridArea = Math.round(this.position.y / 60) +'/'+Math.round(this.position.x / 60) +'/'+  'span ' + Math.round(this.size.height / 60) +'/'+'span ' + Math.round(this.size.width / 60);
        // event.target.style.width = event.rect.width + 'px';
        // event.target.style.height = event.rect.height + 'px';
         this.$emit('updateWindow', {
          size:this.size
        })
      });
  },
  computed: {
    style() {
      let style = "";
      if (this.position.x || this.position.y) {
        style +=
          "transform: translate(" +
          this.position.x +
          "px, " +
          this.position.y +
          "px);";
      }
      if (this.size.width || this.size.height) {
        style +=
          "width:" +
          this.size.width +
          "px; height:" +
          this.size.height +
          "px;";
      }
      return style;
    }
  }
};
</script>

<style scoped lang="scss">
.window {
  background: $primaryDisabled;
  border: 1px solid $primaryLight;
  color: #fff;
  margin-bottom: 20px;
  width: fit-content;

  touch-action: none;
  user-select: none;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: $borderRadius;
  width: 200px;
  height: 40px;
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
</style>
