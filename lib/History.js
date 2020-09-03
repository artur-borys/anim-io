export class History {
  constructor() {
    this.data = []
    this._top = 0
  }

  push(element) {
    if (this.top < this.data.length) {
      this.data = this.data.slice(0, this.top + 1)
    }
    this.data.push(element)
    this.top = this.data.length - 1
  }

  back() {
    if (this.top > 0) {
      this.top -= 1
    }
  }

  forward() {
    if (this.top < this.data.length - 1) {
      this.top += 1
    }
  }

  get top() {
    return this._top
  }

  set top(value) {
    this._top = value
  }

  get canGoBack() {
    return this._top > 0
  }

  get canGoForward() {
    return this._top < this.data.length - 1
  }

  peek() {
    return this.data[this.top]
  }

  isEmpty() {
    return this.data.length === 0
  }
}
