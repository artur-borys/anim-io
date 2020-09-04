<template>
  <div class="drawing-canvas" :style="`width: ${width}px; height: ${height}px`">
    <div v-for="layer in layers" :key="layer.name" class="drawing-layer">
      <canvas :ref="layer.name" :width="width" :height="height" />
    </div>
    <div class="pointer-layer">
      <canvas
        ref="cursorCanvas"
        :width="width"
        :height="height"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mousemove="onMouseMove"
        @mouseout="onMouseOut"
        @touchstart="onMouseDown"
        @touchmove="onMouseMove"
        @touchend="onMouseUp"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    width: Number,
    height: Number,
    pencil: {
      type: Object,
      default: () => ({
        color: '#000',
        width: 10,
      }),
    },
    mode: {
      type: String,
      default: 'draw',
    },
  },
  data() {
    return {
      layers: [
        {
          name: 'background',
          backgroundColor: '#fff',
          previousState: null,
        },
        {
          name: 'layer1',
          backgroundColor: 'transparent',
          previousState: null,
        },
      ],
      activeLayer: 'layer1',
      mousePressed: false,
      lastPos: {
        x: 0,
        y: 0,
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      const backgroundCanvas = this.$refs.background[0]
      const ctx = backgroundCanvas.getContext('2d')
      ctx.fillStyle = this.layers[0].backgroundColor
      ctx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height)
      this.setCurrentAsPrevious('background')
      this.storeAction('layer1')
    })
  },
  methods: {
    getCanvasPosition(e) {
      const { pageX, pageY } = e.touches ? e.touches[0] : e
      const rect = this.$refs.cursorCanvas.getBoundingClientRect()
      const x = pageX - rect.left
      const y = pageY - rect.top

      return { x, y }
    },
    onMouseDown(e) {
      this.mousePressed = true
      const { x, y } = this.getCanvasPosition(e)
      this.draw(x, y)
    },
    onMouseUp() {
      this.mousePressed = false
      this.storeAction(this.activeLayer)
    },
    onMouseOut() {
      this.clearPointer()
    },
    onMouseMove(e) {
      const { x, y } = this.getCanvasPosition(e)
      if (!e.touches) {
        this.drawPointer(x, y)
      }

      if (this.mousePressed) {
        this.draw(x, y, true)
      }
    },
    setCurrentAsPrevious(layerName) {
      const layer = this.layers.find((l) => l.name === layerName)
      const currentState = this.$refs[layer.name][0]
        .getContext('2d')
        .getImageData(0, 0, this.width, this.height)
      layer.previousState = currentState
    },
    storeAction(layerName) {
      const layer = this.layers.find((l) => l.name === layerName)
      const currentState = this.$refs[layer.name][0]
        .getContext('2d')
        .getImageData(0, 0, this.width, this.height)
      const historyEntry = {
        layerName: layer.name,
        previousState: layer.previousState,
        currentState,
      }
      layer.previousState = currentState
      this.$emit('layer-draw', historyEntry)
    },
    drawPointer(x, y) {
      const ctx = this.$refs.cursorCanvas.getContext('2d')
      ctx.clearRect(0, 0, this.width, this.height)
      ctx.beginPath()
      ctx.fillStyle = this.mode === 'draw' ? this.pencil.color : '#fff'
      ctx.strokeStyle = this.pencil.color
      ctx.arc(x, y, this.pencil.width / 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    },
    clearPointer() {
      const ctx = this.$refs.cursorCanvas.getContext('2d')
      ctx.clearRect(0, 0, this.width, this.height)
    },
    draw(x, y, isDown = false) {
      if (isDown) {
        const ctx = this.$refs[this.activeLayer][0].getContext('2d')
        ctx.beginPath()
        ctx.globalCompositeOperation = 'source-over'
        if (this.mode === 'draw') {
          ctx.strokeStyle = this.pencil.color
          ctx.lineWidth = this.pencil.width
          ctx.lineJoin = 'round'
          ctx.moveTo(this.lastPos.x, this.lastPos.y)
          ctx.lineTo(x, y)
          ctx.closePath()
          ctx.stroke()
        } else if (this.mode === 'erase') {
          ctx.globalCompositeOperation = 'destination-out'
          ctx.strokeStyle = null
          ctx.lineWidth = 10
          ctx.lineJoin = 'round'
          ctx.moveTo(this.lastPos.x, this.lastPos.y)
          ctx.lineTo(x, y)
          ctx.closePath()
          ctx.stroke()
        }
      }
      this.lastPos.x = x
      this.lastPos.y = y
    },
    setState(historyEntry) {
      const layer = this.layers.find((l) => l.name === historyEntry.layerName)
      layer.previousState = historyEntry.previousState
      const ctx = this.$refs[layer.name][0].getContext('2d')
      ctx.putImageData(historyEntry.currentState, 0, 0)
    },
  },
}
</script>
<style lang="scss" scoped>
.drawing-canvas {
  position: relative;
  cursor: none;
}

.drawing-layer,
.pointer-layer {
  position: fixed;
}
</style>
