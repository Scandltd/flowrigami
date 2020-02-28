import Rectangle, { RectangleParams } from '@app/flow/geometry/shapes/Rectangle';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { createClosedPath } from '@app/flow/utils/Path2DUtils';


export default class CanvasRectangle extends CanvasShape {
  public name = 'CanvasRectangle';

  private rectangle: Rectangle;
  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, rectangleParams: RectangleParams) {
    super(canvas, htmlLayer);
    this.rectangle = new Rectangle(rectangleParams);
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private createPath2D() {
    const x = this.rectangle.x;
    const y = this.rectangle.y;
    const halfWidth = this.rectangle.width/2;
    const halfHeight = this.rectangle.height/2;

    const leftTop = { x: x - halfWidth, y: y + halfHeight };
    const rightTop = { x: x + halfWidth, y: y + halfHeight };
    const rightBottom = { x: x + halfWidth, y: y - halfHeight };
    const leftBottom = { x: x - halfWidth, y: y - halfHeight };

    const borderRadius = this.rectangle.borderRadius;

    return createClosedPath([leftTop, rightTop, rightBottom, leftBottom], borderRadius);
  };

  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  public move(dx: number, dy: number) {
    this.rectangle.x += dx;
    this.rectangle.y += dy;
  }
}
