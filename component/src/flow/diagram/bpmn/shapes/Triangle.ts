import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface TriangleParams {
  x: number;
  y: number;
  outerRadius: number;
}

export default class Triangle extends CanvasShape {
  name = 'Triangle';
  x: number;
  y: number;
  outerRadius: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, triangleParams: TriangleParams) {
    super(canvas, htmlLayer);
    this.x = triangleParams.x;
    this.y = triangleParams.y;
    this.outerRadius = triangleParams.outerRadius;
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

    path.moveTo(this.x, this.y - this.outerRadius);
    path.lineTo(this.x + Math.sqrt(3)/2*this.outerRadius, this.y + this.outerRadius/2);
    path.lineTo(this.x - Math.sqrt(3)/2*this.outerRadius, this.y + this.outerRadius/2);
    path.closePath();

    return path;
  }
}
