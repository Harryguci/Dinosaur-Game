export default class Obstacle {
  constructor(x, y, h) {
    this.state.x = x;
    this.state.y = y;
    this.height = h;
  }
  
  display() {
    return `
     <div class="obs-${this.height}" style="right=${state.x}; bottom="${state.y}"></div>   
    `
  }

}
