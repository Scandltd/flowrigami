import Line, { LineParams } from '@app/flow/geometry/shapes/Line';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { createPath } from '@app/flow/utils/Path2DUtils';


export default class CanvasLine extends CanvasShape {
  public name = 'CanvasLine';

  private line: Line;
  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, lineParams: LineParams, shapeStyle: ShapeStyle) {
    super(canvas, htmlLayer);
    this.line = new Line(lineParams);
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.shapeStyle);
  }

  private createPath2D() {
    const line = this.line;
    return createPath([line.from, ...line.midPoints, line.to], line.borderRadius);
  };

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  public move(dx: number, dy: number) {
    this.line.from.x += dx;
    this.line.from.y += dy;

    this.line.midPoints.forEach((it) => {
      it.x += dx;
      it.y += dy;
    });

    this.line.to.x += dx;
    this.line.to.y += dy;
  }
}
