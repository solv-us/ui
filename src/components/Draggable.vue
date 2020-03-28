<template>
  <div class="window" ref="draggable">
    <slot></slot>
  </div>
</template>

<script>
import interact from 'interactjs'

export default {
  name: 'Draggable',
  data(){
    return {
      screenX: 0,
      screenY: 0
    };
  },
  mounted() {
    let myDraggable = this.$refs.draggable;
   
    interact(myDraggable)
    .draggable({
      allowFrom: '.drag-handle',
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.createSnapGrid({ x: 20, y: 20 })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        }),
        interact.modifiers.restrict({
          restriction: myDraggable.parentNode,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: true
        })
      ],
      inertia: false
    })
    .on('dragmove', (event) => {
      this.screenX += event.dx
      this.screenY += event.dy

      event.target.style.webkitTransform =
      event.target.style.transform =
          'translate(' + this.screenX + 'px, ' + this.screenY + 'px)'
    })

  }
}
</script>

<style scoped>
.window{
  background:#4f5468;
  border:1px solid #4f5468;
  color:#191A1E;
  margin-bottom:20px;
  height: 100%;
  touch-action: none;
  user-select: none;
  overflow: hidden;
  grid-column: span 2;
  grid-row: span 2;
}
header{
  width:100%;
  height:38px;
  top:0;
  left:0;
  background:#262832;
  padding: 10px;
  color:#fff;
  font-size:0.9em;
}
.content{
  padding:5px;
}
h1,h2,h3,h4,h5,h6{
  color:#fff;
}
</style>
