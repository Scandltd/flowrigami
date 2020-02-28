import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface CrossParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Cross extends CanvasShape {
  name = 'Cross';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, crossParams: CrossParams) {
    super(canvas, htmlLayer);
    this.x = crossParams.x;
    this.y = crossParams.y;
    this.width = crossParams.width;
    this.height = crossParams.height;
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
    path.moveTo(this.x - this.width/3, this.y);
    path.lineTo(this.x - this.width, this.y - this.height*2/3);
    path.lineTo(this.x - this.width*2/3, this.y - this.height);
    path.lineTo(this.x, this.y - this.height/3);
    path.lineTo(this.x + this.width*2/3, this.y - this.height);
    path.lineTo(this.x + this.width, this.y - this.height*2/3);
    path.lineTo(this.x + this.width/3, this.y);
    path.lineTo(this.x + this.width, this.y + this.height*2/3);
    path.lineTo(this.x + this.width*2/3, this.y + this.height);
    path.lineTo(this.x, this.y + this.height/3);
    path.lineTo(this.x - this.width*2/3, this.y + this.height);
    path.lineTo(this.x - this.width, this.y + this.height*2/3);
    path.closePath();
    return path;
  }
}
