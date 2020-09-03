<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center h-screen pt-3">
      <toolbar
        ><button
          class="toolbar-item"
          :class="{ disabled: !history.canGoBack }"
          @click="undo"
        >
          <undo-icon />
        </button>
        <button
          class="toolbar-item"
          :class="{ disabled: !history.canGoForward }"
          @click="redo"
        >
          <redo-icon />
        </button>
        <button
          class="toolbar-item"
          :class="{ active: mode === 'draw' }"
          @click="setMode('draw')"
        >
          <pencil-icon />
        </button>
        <button
          class="toolbar-item"
          :class="{ active: mode === 'erase' }"
          @click="setMode('erase')"
        >
          <eraser-icon /></button
      ></toolbar>
      <div class="flex flex-grow items-center">
        <drawing-canvas
          ref="canvas"
          class="shadow"
          :width="400"
          :height="400"
          :mode="mode"
          @layer-draw="onLayerDraw"
        />
        <!-- <canvas
          ref="canvas"
          class="canvas bg-white shadow"
          width="400"
          height="400"
          @mousedown="onMouseDown"
          @mouseup="onMouseUp"
          @mousemove="onMouseMove"
          @touchstart="onMouseDown"
          @touchmove="onMouseMove"
          @touchend="onMouseUp"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { History } from '@/lib/History.js'
import DrawingCanvas from '@/components/DrawingCanvas'
import Toolbar from '@/components/Toolbar/Toolbar'

export default {
  name: 'Project',
  components: {
    DrawingCanvas,
    Toolbar,
  },
  data() {
    return {
      canvasCtx: undefined,
      mousePressed: false,
      lastPos: {
        x: 0,
        y: 0,
      },
      history: new History(),
      mode: 'draw',
      pencil: {
        color: '#000',
        width: 1,
      },
    }
  },
  methods: {
    undo() {
      this.history.back()
      this.$refs.canvas.setState(this.history.peek())
    },
    redo() {
      this.history.forward()
      this.$refs.canvas.setState(this.history.peek())
    },
    setMode(mode) {
      this.mode = mode
    },
    onLayerDraw(historyEntry) {
      this.history.push(historyEntry)
    },
  },
}
</script>
<style lang="scss" scoped>
.canvas {
  cursor: crosshair;
}
</style>
