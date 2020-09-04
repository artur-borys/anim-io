<template>
  <div class="color-picker">
    <div class="color-set">
      <saturation
        ref="saturation"
        :hsv="hsv"
        :color="color"
        @saturationSelect="onSaturationSelect"
      />
      <hue :hsv="hsv" @hueSelect="onHueSelect" />
      <div
        class="flex-grow w-20 ml-2 rounded"
        :style="`background-color: ${color}`"
      />
    </div>
  </div>
</template>
<script>
import Saturation from './Saturation'
import Hue from './Hue'
import mixin from './mixin'
export default {
  components: {
    Hue,
    Saturation,
  },
  mixins: [mixin],
  data() {
    return {
      color: '#ff0000',
      rgb: {
        r: 255,
        g: 0,
        b: 0,
      },
      hsv: {
        h: 0,
        s: 0,
        v: 0,
      },
    }
  },
  watch: {
    color() {
      this.$emit('colorSelect', this.color)
    },
  },
  mounted() {
    this.$refs.saturation.calculateColor()
  },
  methods: {
    onHueSelect(rgb) {
      this.rgb = rgb
      this.hsv.h = this.rgb2hsv(rgb).h
      this.color = this.rgb2hex(rgb)
      this.$nextTick(() => {
        this.$refs.saturation.renderColor()
        this.$refs.saturation.renderSlide()
        this.$refs.saturation.calculateColor()
      })
    },
    onSaturationSelect(rgb) {
      this.rgb = rgb
      this.hsv = this.rgb2hsv(rgb)
      this.color = this.rgb2hex(rgb)
    },
  },
}
</script>
<style lang="scss" scoped>
.color-set {
  @apply flex;
}
</style>
