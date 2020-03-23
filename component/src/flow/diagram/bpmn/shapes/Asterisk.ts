import CanvasShape from '@app/flow/diagram/bpmn/BpmnCanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface AsteriskParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Asterisk extends CanvasShape {
  name = 'Asterisk';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, asteriskParams: AsteriskParams) {
    super(canvas, htmlLayer);
    this.x = asteriskParams.x;
    this.y = asteriskParams.y;
    this.width = asteriskParams.width;
    this.height = asteriskParams.height;
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
    path.moveTo(this.x, this.y - this.height/2);
    path.lineTo(this.x, this.y + this.height/2);
    path.moveTo(this.x - this.width/2, this.y);
    path.lineTo(this.x + this.width/2, this.y);
    path.moveTo(this.x + this.width/2 - 3, this.y - this.height/2 + 3);
    path.lineTo(this.x - this.width/2 + 3, this.y + this.height/2 - 3);
    path.moveTo(this.x - this.width/2 + 3, this.y - this.height/2 + 3);
    path.lineTo(this.x + this.width/2 - 3, this.y + this.height/2 - 3);
    return path;
  }
}
