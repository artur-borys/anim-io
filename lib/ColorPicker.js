function hex(number) {
  const pad = number < 16 ? '0' : ''
  return `${pad}${number.toString(16)}`
}

export function getHexValue(color) {
  return `#${hex(color[0])}${hex(color[1])}${hex(color[2])}`
}

export function generateColorRange(ctx) {
  ctx.height = 256 * 6
  const { width } = ctx.canvas
  const color = [255, 0, 0]
  const baseLine = 0
  for (let i = 0; i < 256; i++) {
    color[2] = i
    ctx.beginPath()
    ctx.strokeStyle = getHexValue(color)
    console.log(getHexValue(color))
    ctx.moveTo(0, baseLine + i)
    ctx.lineTo(width, baseLine + i)
    ctx.stroke()
    ctx.closePath()
  }
}
