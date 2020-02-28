import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface HexagonParams {
  x: number;
  y: number;
  borderLength: number;
}

export default class Hexagon extends CanvasShape {
  name = 'Hexagon';
  x: number;
  y: number;
  borderLength: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, hexagonParams: HexagonParams) {
    super(canvas, htmlLayer);
    this.x = hexagonParams.x;
    this.y = hexagonParams.y;
    this.borderLength = hexagonParams.borderLength;
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  private createPath2D() {

    const path = new Path2D();
    path.moveTo(this.x - this.borderLength/2 - 0.5*this.borderLength, this.y);
    path.lineTo(this.x - this.borderLength/2, this.y - Math.sqrt(3)/2*this.borderLength);
    path.lineTo(this.x + this.borderLength/2, this.y - Math.sqrt(3)/2*this.borderLength);
    path.lineTo(this.x + this.borderLength/2 + 0.5*this.borderLength, this.y);
    path.lineTo(this.x + this.borderLength/2, this.y + Math.sqrt(3)/2*this.borderLength);
    path.lineTo(this.x - this.borderLength/2, this.y + Math.sqrt(3)/2*this.borderLength);
    path.closePath();
    return path;
  }
}
