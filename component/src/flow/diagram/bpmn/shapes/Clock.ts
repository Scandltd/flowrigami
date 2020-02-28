import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface ClockParams {
  x: number;
  y: number;
  radius: number
}

export default class Clock extends CanvasShape {
  name = 'Clock';
  x: number;
  y: number;
  radius: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, clockParams: ClockParams) {
    super(canvas, htmlLayer);
    this.x = clockParams.x;
    this.y = clockParams.y;
    this.radius = clockParams.radius;
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
    const clock = new Path2D();
    clock.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    clock.moveTo(this.x + this.radius*0.5, this.y - this.radius*Math.sqrt(3)/2);
    clock.lineTo(this.x + this.radius*0.7*0.5, this.y - this.radius*0.7*Math.sqrt(3)/2);
    clock.moveTo(this.x + this.radius*Math.sqrt(3)/2, this.y - this.radius*0.5);
    clock.lineTo(this.x + this.radius*0.7*Math.sqrt(3)/2, this.y - this.radius*0.7*0.5);
    clock.moveTo(this.x + this.radius, this.y);
    clock.lineTo(this.x + this.radius*0.7, this.y);
    clock.moveTo(this.x + this.radius*Math.sqrt(3)/2, this.y + this.radius*0.5);
    clock.lineTo(this.x + this.radius*0.7*Math.sqrt(3)/2, this.y + this.radius*0.7*0.5);
    clock.moveTo(this.x + this.radius*0.5, this.y + this.radius*Math.sqrt(3)/2);
    clock.lineTo(this.x + this.radius*0.7*0.5, this.y + this.radius*0.7*Math.sqrt(3)/2);
    clock.moveTo(this.x, this.y + this.radius);
    clock.lineTo(this.x, this.y + this.radius*0.7);
    clock.moveTo(this.x - this.radius*0.5, this.y + this.radius*Math.sqrt(3)/2);
    clock.lineTo(this.x - this.radius*0.7*0.5, this.y + this.radius*0.7*Math.sqrt(3)/2);
    clock.moveTo(this.x - this.radius*Math.sqrt(3)/2, this.y + this.radius*0.5);
    clock.lineTo(this.x - this.radius*0.7*Math.sqrt(3)/2, this.y + this.radius*0.7*0.5);
    clock.moveTo(this.x - this.radius, this.y);
    clock.lineTo(this.x - this.radius*0.7, this.y);
    clock.moveTo(this.x - this.radius*Math.sqrt(3)/2, this.y - this.radius*0.5);
    clock.lineTo(this.x - this.radius*0.7*Math.sqrt(3)/2, this.y - this.radius*0.7*0.5);
    clock.moveTo(this.x - this.radius*0.5, this.y - this.radius*Math.sqrt(3)/2);
    clock.lineTo(this.x - this.radius*0.7*0.5, this.y - this.radius*0.7*Math.sqrt(3)/2);
    clock.moveTo(this.x, this.y - this.radius);
    clock.lineTo(this.x, this.y - this.radius*0.7);
    clock.moveTo(this.x, this.y);
    clock.lineTo(this.x + this.radius*0.1, this.y - this.radius*0.6);
    clock.moveTo(this.x, this.y);
    clock.lineTo(this.x + this.radius*0.4, this.y);
    return clock;
  }
}
