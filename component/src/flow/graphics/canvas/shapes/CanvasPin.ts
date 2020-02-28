import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


export type PinParams = {
  x: number;
  y: number;
  radius: number;
  height?: number;
}

export default class CanvasPin extends CanvasShape {
  public name = 'CanvasPin';

  private shapeStyle: ShapeStyle;
  private x: number;
  private y: number;
  private radius: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, pinParams: PinParams) {
    super(canvas, htmlLayer);
    this.shapeStyle = shapeStyle;
    this.x = pinParams.x;
    this.y = pinParams.y;
    this.radius = pinParams.radius;
    this.height = pinParams.height || 1.5*pinParams.radius;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private createPath2D() {
    const radius = this.radius;
    const height = this.height;
    const x = this.x;
    const y = this.y - (height - radius)/4;

    const pin = new Path2D();
    pin.moveTo(x, y - radius);
    pin.arc(x, y, radius, -Math.PI/2, 0);
    pin.bezierCurveTo(x + radius, y + 0.3*height, x + 0.5*radius, y + 0.7*height, x, y + height);
    pin.bezierCurveTo(x - 0.5*radius, y + 0.7*height, x - radius, y + 0.3*height, x - radius, y);
    pin.arc(x, y, radius, -Math.PI, -Math.PI/2);
    pin.closePath();

    return pin;
  };

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

  public setStyle(shapeStyle: ShapeStyle) {
    this.shapeStyle = shapeStyle;
  }
}
