import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface DataObjParams {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export default class DataObjWithoutAngle extends CanvasShape {
  public name = 'DataObjWithoutAngle';

  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;

  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, dataObjParams: DataObjParams) {
    super(canvas, htmlLayer);
    this.x = dataObjParams.x;
    this.y = dataObjParams.y;
    this.width = dataObjParams.width;
    this.height = dataObjParams.height;
    this.borderRadius = dataObjParams.borderRadius || 0;
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }


  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  private createPath2D() {

    const path = new Path2D();
    path.moveTo(this.x + 0.2*this.width, this.y - this.height);
    path.lineTo(this.x + this.width, this.y - this.height + 0.8*this.width);
    path.lineTo(this.x + this.width, this.y + this.height);
    path.lineTo(this.x - this.width, this.y + this.height);
    path.lineTo(this.x - this.width, this.y - this.height);
    path.lineTo(this.x + 0.2*this.width, this.y - this.height);
    return path;
  }
}
