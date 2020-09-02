<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center h-screen pt-3">
      <div class="toolbar">
        <button
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
          <eraser-icon />
        </button>
      </div>
      <div class="flex flex-grow items-center">
        <canvas
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
        />
      </div>
    </div>
  </div>
</template>

<script>
import { History } from '@/lib/History.js'

export default {
  name: 'Project',
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
  mounted() {
    const ctx = this.$refs.canvas.getContext('2d')
    this.canvasCtx = ctx
    ctx.width = 400
    ctx.height = 400
    this.history.push(ctx.getImageData(0, 0, 400, 400))
  },
  methods: {
    getCanvasPosition(e) {
      const { pageX, pageY } = e.touches ? e.touches[0] : e
      const rect = this.$refs.canvas.getBoundingClientRect()
      const x = pageX - rect.left
      const y = pageY - rect.top

      return { x, y }
    },
    onMouseDown(e) {
      this.mousePressed = true
      const rect = this.$refs.canvas.getBoundingClientRect()
      const x = e.pageX - rect.left
      const y = e.pageY - rect.top
      this.drawMouse(x, y)
    },
    onMouseUp() {
      this.mousePressed = false
      this.history.push(this.canvasCtx.getImageData(0, 0, 400, 400))
    },
    onMouseMove(e) {
      e.preventDefault()
      const { x, y } = this.getCanvasPosition(e)

      if (this.mousePressed) {
        this.drawMouse(x, y, true)
      }
      this.hideCursor = false
    },
    onMouseOut() {
      this.hideCursor = true
    },
    drawMouse(x, y, isDown = false) {
      if (isDown) {
        console.log('x')
        const ctx = this.canvasCtx
        ctx.beginPath()
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 5
        ctx.lineJoin = 'round'
        ctx.moveTo(this.lastPos.x, this.lastPos.y)
        ctx.lineTo(x, y)
        ctx.closePath()
        ctx.stroke()
      }
      this.lastPos.x = x
      this.lastPos.y = y
    },
    undo() {
      this.history.back()
      console.log(this.history.peek())
      this.canvasCtx.clearRect(0, 0, 400, 400)
      this.canvasCtx.putImageData(this.history.peek(), 0, 0)
    },
    redo() {
      this.history.forward()
      this.canvasCtx.clearRect(0, 0, 400, 400)
      console.log(this.history.peek())
      this.canvasCtx.putImageData(this.history.peek(), 0, 0)
    },
    setMode(mode) {
      this.mode = mode
    },
  },
}
</script>
<style lang="scss" scoped>
.canvas {
  cursor: crosshair;
}
.toolbar {
  @apply bg-white;
  @apply border;
  @apply border-gray-500;
  @apply rounded-full;
  @apply px-2;
  @apply flex;
  position: fixed;
  top: 0.75rem;
  overflow: hidden;
}

.toolbar-item {
  @apply p-2;
  box-sizing: border-box;
  font-size: 1.25rem;

  &.disabled {
    @apply text-gray-500;
    cursor: not-allowed;
  }

  &:not(.disabled):hover {
    @apply bg-gray-200;
    cursor: pointer;
    @apply text-blue-500;
  }

  &.active {
    @apply text-blue-500;
  }
}
</style>
