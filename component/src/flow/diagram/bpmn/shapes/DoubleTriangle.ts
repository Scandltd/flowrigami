import CanvasShape from '@app/flow/diagram/bpmn/BpmnCanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface DoubleTriangleParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class DoubleTriangle extends CanvasShape {
  name = 'DoubleTriangle';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, doubleTriangleParams: DoubleTriangleParams) {
    super(canvas, htmlLayer);
    this.x = doubleTriangleParams.x;
    this.y = doubleTriangleParams.y;
    this.width = doubleTriangleParams.width;
    this.height = doubleTriangleParams.height;
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
    path.moveTo(this.x - this.width, this.y);
    path.lineTo(this.x, this.y - this.height);
    path.lineTo(this.x, this.y);
    path.lineTo(this.x + this.width, this.y - this.height);
    path.lineTo(this.x + this.width, this.y + this.height);
    path.lineTo(this.x, this.y);
    path.lineTo(this.x, this.y + this.height);
    path.closePath();
    return path;
  }
}
