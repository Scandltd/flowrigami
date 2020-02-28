export interface CircleParams {
  x: number;
  y: number;
  radius: number;
}

export default class Circle {
  x: number;
  y: number;
  radius: number;

  constructor({ x, y, radius }: CircleParams) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
