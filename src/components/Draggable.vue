<template>
  <div
    class="window"
    ref="draggable"
  >
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
      screenY: 0,
      screenWidth:100,
      screenHeight:100
    };
  },
  mounted() {
    let myDraggable = this.$refs.draggable;
   
    interact(myDraggable)
    .draggable({
      allowFrom: 'header',
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
      inertia: false,
      autoScroll:false
    }).resizable(
      { edges: {
      left: false,
      right: true,
      bottom: true,
      top: false
    },modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.createSnapGrid({ x: 20, y: 20 })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        })]}
    )
    .on('dragmove', (event) => {
      this.screenX += event.dx
      this.screenY += event.dy
      // event.target.style.webkitTransform =
      // event.target.style.transform =
      //     'translate(' + this.screenX + 'px, ' + this.screenY + 'px)'
      event.target.style.top = this.screenY + 'px';
       event.target.style.left = this.screenX + 'px';

    // event.target.style.gridArea = Math.round(this.screenY / 60) +'/'+Math.round(this.screenX / 60) +'/'+  'span ' + Math.round(this.screenHeight / 60) +'/'+'span ' + Math.round(this.screenWidth / 60);


    }).on('resizemove', (event) =>{
      this.screenWidth = event.rect.width;
      this.screenHeight = event.rect.height;
    // event.target.style.gridArea = Math.round(this.screenY / 60) +'/'+Math.round(this.screenX / 60) +'/'+  'span ' + Math.round(this.screenHeight / 60) +'/'+'span ' + Math.round(this.screenWidth / 60);
      event.target.style.width = event.rect.width + 'px';
      event.target.style.height = event.rect.height + 'px';
    
    })

  }
}
</script>

<style scoped>
.window {
  background: #4f5468;
  border: 1px solid #4f5468;
  color: #fff;
  margin-bottom: 20px;
  width:fit-content;
  position: relative;
  touch-action: none;
  user-select: none;
  overflow: hidden;
  grid-column: span 2;
  grid-row: span 2;
  transition: grid-row 0.2s, grid-column 0.2s;
}
.window .content {
  font-size: 0.9em;
}
header {
  width: 100%;
  top: 0;
  left: 0;
  background: #262832;
  padding: 10px;
  color: #fff;
  font-size: 0.9em;
  text-align: center;
}
.content {
  padding: 5px;
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
