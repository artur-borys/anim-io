<template>
  <div class="saturation" @mousedown.prevent.stop="selectSaturation">
    <canvas ref="saturationCanvas" class="rounded" />
    <div class="slide" :style="saturationSlideStyle" />
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    color: {
      type: String,
      default: '#ff0000',
    },
    hsv: {
      type: Object,
      default: () => ({ h: 0, s: 0, v: 0 }),
    },
    size: {
      type: Number,
      default: 152,
    },
  },
  data() {
    return {
      saturationSlideStyle: null,
      lastPos: {
        x: 0,
        y: 0,
      },
    }
  },
  mounted() {
    this.lastPos = {
      x: this.hsv.s * this.size,
      y: (1 - this.hsv.v) * this.size,
    }
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const ctx = this.$refs.saturationCanvas.getContext('2d')
      const size = this.size
      ctx.canvas.width = size
      ctx.canvas.height = size

      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, size, size)

      this.createLinearGradient(
        'l',
        ctx,
        size,
        size,
        '#ffffff',
        'rgba(255, 255, 255, 0)'
      )
      this.createLinearGradient(
        'p',
        ctx,
        size,
        size,
        'rgba(0, 0, 0, 0)',
        '#000000'
      )
    },
    renderSlide() {
      this.saturationSlideStyle = {
        left: this.hsv.s * this.size - 5 + 'px',
        top: (1 - this.hsv.v) * this.size - 5 + 'px',
      }
    },
    selectSaturation(e) {
      const {
        top: saturationTop,
        left: saturationLeft,
      } = this.$el.getBoundingClientRect()
      const mousemove = (e) => {
        let x = e.clientX - saturationLeft
        let y = e.clientY - saturationTop
        if (x < 0) {
          x = 0
        }
        if (y < 0) {
          y = 0
        }
        if (x > this.size) {
          x = this.size
        }
        if (y > this.size) {
          y = this.size
        }
        this.saturationSlideStyle = {
          left: x - 5 + 'px',
          top: y - 5 + 'px',
        }
        this.lastPos = { x, y }
        this.calculateColor()
      }
      mousemove(e)
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
    calculateColor() {
      const ctx = this.$refs.saturationCanvas.getContext('2d')
      const { x, y } = this.lastPos
      const imgData = ctx.getImageData(
        Math.min(x, this.size - 1),
        Math.min(y, this.size - 1),
        1,
        1
      )
      const [r, g, b] = imgData.data
      this.$emit('saturationSelect', { r, g, b })
    },
  },
}
</script>
<style lang="scss" scoped>
.saturation {
  position: relative;
  cursor: pointer;
  .slide {
    position: absolute;
    left: 100px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
