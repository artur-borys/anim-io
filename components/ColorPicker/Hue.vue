<template>
  <div class="hue" @mousedown.prevent.stop="selectHue">
    <canvas ref="hueCanvas" class="rounded" />
    <div :style="slideHueStyle" class="slide" />
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 15,
    },
    height: {
      type: Number,
      default: 152,
    },
    hsv: {
      type: Object,
      default: () => ({ h: 0, s: 0, v: 0 }),
    },
  },
  data() {
    return {
      slideHueStyle: null,
    }
  },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const width = this.width
      const height = this.height
      const canvas = this.$refs.hueCanvas
      const ctx = canvas.getContext('2d')
      canvas.height = height
      canvas.width = width

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      const part = 0.17
      gradient.addColorStop(0, '#FF0000')
      gradient.addColorStop(part * 1, '#FF00FF')
      gradient.addColorStop(part * 2, '#0000FF')
      gradient.addColorStop(part * 3, '#00FFFF')
      gradient.addColorStop(part * 4, '#00FF00')
      gradient.addColorStop(part * 5, '#FFFF00')
      gradient.addColorStop(1, '#FF0000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    },
    renderSlide() {
      this.slideHueStyle = {
        top: (1 - this.hsv.h / 360) * this.height - 2 + 'px',
      }
    },
    selectHue(e) {
      const { top: hueTop } = this.$el.getBoundingClientRect()
      const ctx = e.target.getContext('2d')

      const mouseMove = (e) => {
        let y = e.clientY - hueTop
        if (y < 0) {
          y = 0
        } else if (y > this.height) {
          y = this.height
        }

        this.slideHueStyle = {
          top: y - 2 + 'px',
        }

        const imgData = ctx.getImageData(0, Math.min(y, this.height - 1), 1, 1)
        const [r, g, b] = imgData.data
        this.$emit('hueSelect', { r, g, b })
      }

      mouseMove(e)

      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }

      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    },
  },
}
</script>
<style lang="scss">
.hue {
  position: relative;
  margin-left: 8px;
  cursor: pointer;
  .slide {
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    height: 4px;
    background: #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
