import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface PlusParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Plus extends CanvasShape {
  name = 'Plus';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, plusParams: PlusParams) {
    super(canvas, htmlLayer);
    this.x = plusParams.x;
    this.y = plusParams.y;
    this.width = plusParams.width;
    this.height = plusParams.height;
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
    path.moveTo(this.x - this.width/4, this.y - this.height/4);
    path.lineTo(this.x - this.width/4, this.y - this.height);
    path.lineTo(this.x + this.width/4, this.y - this.height);
    path.lineTo(this.x + this.width/4, this.y - this.height/4);
    path.lineTo(this.x + this.width, this.y - this.height/4);
    path.lineTo(this.x + this.width, this.y + this.height/4);
    path.lineTo(this.x + this.width/4, this.y + this.height/4);
    path.lineTo(this.x + this.width/4, this.y + this.height);
    path.lineTo(this.x - this.width/4, this.y + this.height);
    path.lineTo(this.x - this.width/4, this.y + this.height/4);
    path.lineTo(this.x - this.width, this.y + this.height/4);
    path.lineTo(this.x - this.width, this.y - this.height/4);
    path.closePath();
    return path;
  }
}
