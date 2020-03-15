import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface SheetParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Sheet extends CanvasShape {
  name = 'Sheet';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;

  private leftTop: Coordinates;
  private rightTop: Coordinates;
  private leftBottom: Coordinates;
  private rightBottom: Coordinates;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, sheetParams: SheetParams) {
    super(canvas, htmlLayer);
    this.x = sheetParams.x;
    this.y = sheetParams.y;
    this.width = sheetParams.width;
    this.height = sheetParams.height;
    this.shapeStyle = shapeStyle;

    this.leftTop = new Coordinates(this.x - this.width, this.y - this.height);
    this.rightTop = new Coordinates(this.x + this.width, this.y - this.height);
    this.rightBottom = new Coordinates(this.x + this.width, this.y + this.height);
    this.leftBottom = new Coordinates(this.x - this.width, this.y + this.height);
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
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
    this.leftTop.move(dx, dy);
    this.leftBottom.move(dx, dy);
    this.rightBottom.move(dx, dy);
    this.rightTop.move(dx, dy);
  }

  private createPath2D() {

    const path = new Path2D();
    path.moveTo(this.leftTop.x, this.leftTop.y);
    path.lineTo(this.rightTop.x, this.rightTop.y);
    path.lineTo(this.rightBottom.x, this.rightBottom.y);
    path.lineTo(this.leftBottom.x, this.leftBottom.y);
    path.lineTo(this.leftTop.x, this.leftTop.y);
    path.moveTo(this.leftTop.x + 2, this.leftTop.y + 0.2*this.height);
    path.lineTo(this.rightTop.x - 2, this.rightTop.y + 0.2*this.height);
    path.moveTo(this.leftTop.x + 2, this.rightTop.y + 0.7*this.height);
    path.lineTo(this.rightTop.x - 2, this.rightTop.y + 0.7*this.height);
    path.moveTo(this.leftTop.x + 2, this.leftTop.y + 1.25*this.height);
    path.lineTo(this.rightTop.x - 2, this.rightTop.y + 1.25*this.height);
    path.moveTo(this.leftTop.x + 2, this.leftTop.y + 1.8*this.height);
    path.lineTo(this.rightTop.x - 2, this.rightTop.y + 1.8*this.height);
    return path;
  }
}
