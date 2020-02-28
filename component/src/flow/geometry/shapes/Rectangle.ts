export interface RectangleParams {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export default class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;

  constructor({ x, y, width, height, borderRadius = 0 }: RectangleParams) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;
  }
}
