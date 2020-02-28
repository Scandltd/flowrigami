export interface RhombusParams {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export default class Rhombus {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;

  constructor({ x, y, width, height, borderRadius = 0 }: RhombusParams) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;
  }
}
