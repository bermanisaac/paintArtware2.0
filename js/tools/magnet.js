/* global app */
window.tools.magnet = {
  name: 'magnet',
  icon: '/images/magnet-icon.png',
  state: {
    selected: false,
    mousePressed: false,
    range: 50,
    strength: 0.5
  },
  events: {
    mousedown: function (e) {

      function getIndex(x, y, range) {
        rowLen = 4 + range * 8
        x = x + range
        y = y + range
        return (x * rowLen) + (y * 4)
      }

      const mouse = app.eventToMouse(e)
      const px = Math.floor(mouse.x)
      const py = Math.floor(mouse.y)

      console.log(py)

      minX = Math.max(0, px - this.state.range)
      minY = Math.max(0, py - this.state.range)

      const pixelsObj = app.ctx.getImageData(minX, minY,
                                          1 + this.state.range * 2,
                                          1 + this.state.range * 2)

      const pixels = pixelsObj.data

      for(i = 3; i < pixels.length; i += 4) {
        pixels[i] = 255
      }

      range = this.state.range
      counter = 0
      console.log(pixels.length)

      for(dist = 1; dist <= this.state.range; dist++) {
        // we go top
        y = dist
        for(x = -dist; x <= dist; x++) {
          srcIdx = getIndex(x, y, range)
          newX = Math.floor(x / 2)
          newY = Math.floor(y / 2)
          newIdx = getIndex(newX, newY, range)

          pixels[newIdx] = pixels[srcIdx]
          pixels[newIdx + 1] = pixels[srcIdx + 1]
          pixels[newIdx + 2] = pixels[srcIdx + 2]
          pixels[newIdx + 3] = pixels[srcIdx + 3]
        }
        // we go right
        x = dist
        for(y = dist; y >= -dist; y--) {
          // pixels[getIndex(x, y, range)] = (counter += 11) % 255
          srcIdx = getIndex(x, y, range)
          newX = Math.floor(x / 2)
          newY = Math.floor(y / 2)
          newIdx = getIndex(newX, newY, range)

          pixels[newIdx] = pixels[srcIdx]
          pixels[newIdx + 1] = pixels[srcIdx + 1]
          pixels[newIdx + 2] = pixels[srcIdx + 2]
          pixels[newIdx + 3] = pixels[srcIdx + 3]
        }
        // we go bot
        y = -dist
        for(x = dist; x >= -dist; x--) {
          // pixels[getIndex(x, y, range)] = (counter += 11) % 255
          srcIdx = getIndex(x, y, range)
          newX = Math.floor(x / 2)
          newY = Math.floor(y / 2)
          newIdx = getIndex(newX, newY, range)

          pixels[newIdx] = pixels[srcIdx]
          pixels[newIdx + 1] = pixels[srcIdx + 1]
          pixels[newIdx + 2] = pixels[srcIdx + 2]
          pixels[newIdx + 3] = pixels[srcIdx + 3]
        }
        // we go left
        x = -dist
        for(y = -dist; y <= dist; y++) {
          // pixels[getIndex(x, y, range)] = (counter += 11) % 255
          srcIdx = getIndex(x, y, range)
          newX = Math.floor(x / 2)
          newY = Math.floor(y / 2)
          newIdx = getIndex(newX, newY, range)

          pixels[newIdx] = pixels[srcIdx]
          pixels[newIdx + 1] = pixels[srcIdx + 1]
          pixels[newIdx + 2] = pixels[srcIdx + 2]
          pixels[newIdx + 3] = pixels[srcIdx + 3]
        }
      }
      //console.log(pixels)
      app.ctx.putImageData(pixelsObj, minX, minY)
    }
  }
}
