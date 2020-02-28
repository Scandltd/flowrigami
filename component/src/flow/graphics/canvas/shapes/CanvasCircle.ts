import Circle, { CircleParams } from '@app/flow/geometry/shapes/Circle';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


export default class CanvasCircle extends CanvasShape {
  public name = 'CanvasCircle';

  private circle: Circle;
  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, circleParams: CircleParams) {
    super(canvas, htmlLayer);
    this.circle = new Circle(circleParams);
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private createPath2D() {
    const circle = new Path2D();
    circle.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2*Math.PI);
    return circle;
  };

  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  public move(dx: number, dy: number) {
    this.circle.x += dx;
    this.circle.y += dy;
  }
}
