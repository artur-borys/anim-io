export default {
  methods: {
    rgb2hex({ r, g, b }) {
      let hex = '#'
      const rs = r.toString(16)
      const gs = g.toString(16)
      const bs = b.toString(16)
      if (r < 16) {
        hex += `0${rs}`
      } else {
        hex += rs
      }
      if (g < 16) {
        hex += `0${gs}`
      } else {
        hex += gs
      }

      if (b < 16) {
        hex += `0${bs}`
      } else {
        hex += bs
      }

      return hex
    },
    rgb2hsv({ r, g, b }) {
      r = r / 255
      g = g / 255
      b = b / 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const delta = max - min
      let h = 0
      if (max === min) {
        h = 0
      } else if (max === r) {
        if (g >= b) {
          h = (60 * (g - b)) / delta
        } else {
          h = (60 * (g - b)) / delta + 360
        }
      } else if (max === g) {
        h = (60 * (b - r)) / delta + 120
      } else if (max === b) {
        h = (60 * (r - g)) / delta + 240
      }
      h = Math.floor(h)
      const s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
      const v = parseFloat(max.toFixed(2))
      return { h, s, v }
    },
    createLinearGradient(direction, ctx, width, height, color1, color2) {
      const isL = direction === 'l'
      const gradient = ctx.createLinearGradient(
        0,
        0,
        isL ? width : 0,
        isL ? 0 : height
      )
      gradient.addColorStop(0.01, color1)
      gradient.addColorStop(0.99, color2)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    },
  },
}
