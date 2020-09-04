<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center h-screen pt-3">
      <toolbar
        ><toolbar-item :disabled="!history.canGoBack" @click="undo">
          <undo-icon />
        </toolbar-item>
        <toolbar-item :disabled="!history.canGoForward" @click="redo">
          <redo-icon />
        </toolbar-item>
        <toolbar-item
          :active="mode === 'draw'"
          dropdown
          @click="setMode('draw')"
        >
          <pencil-icon />
          <div slot="dropdown">
            <h4 class="text-lg font-bold mb-3">Kolor</h4>
            <color-picker @colorSelect="onColorSelect" />
          </div>
        </toolbar-item>
        <toolbar-item
          :active="mode === 'erase'"
          dropdown
          @click="setMode('erase')"
        >
          <eraser-icon />
          <div slot="dropdown">A tu gumki</div>
        </toolbar-item></toolbar
      >
      <div class="flex flex-grow items-center">
        <drawing-canvas
          ref="canvas"
          class="shadow"
          :width="400"
          :height="400"
          :mode="mode"
          :pencil="pencil"
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
import ToolbarItem from '@/components/Toolbar/ToolbarItem'
import ColorPicker from '@/components/ColorPicker/ColorPicker'

export default {
  name: 'Project',
  components: {
    DrawingCanvas,
    Toolbar,
    ToolbarItem,
    ColorPicker,
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
        width: 10,
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
    onColorSelect(color) {
      this.pencil.color = color
    },
  },
}
</script>
<style lang="scss" scoped>
.canvas {
  cursor: crosshair;
}
</style>
