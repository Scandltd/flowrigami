import Line, { LineParams } from '@app/flow/geometry/shapes/Line';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { areCoordinatesInRectangle, areCoordinatesOnInfiniteLine } from '@app/flow/utils/MathUtils';
import { createPath } from '@app/flow/utils/Path2DUtils';


const LINE_DETECTION_DELTA = 10;

export default class CanvasLine extends CanvasShape {
  public name = 'CanvasLine';

  line: Line;
  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, lineParams: LineParams) {
    super(canvas, htmlLayer);
    this.line = new Line(lineParams);
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private createPath2D() {
    return createPath([this.line.from, ...this.line.midPoints, this.line.to], this.line.borderRadius);
  }

  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    let isInLine = false;

    const coordinateList = [this.line.from, ...this.line.midPoints, this.line.to];

    const length = coordinateList.length;
    if (length > 1) {
      for (let i = 1; i < length; i++) {
        const from = coordinateList[i - 1];
        const to = coordinateList[i];

        isInLine = areCoordinatesInRectangle({ x, y }, from, to) && areCoordinatesOnInfiniteLine({ x, y }, from, to, LINE_DETECTION_DELTA);
        if (isInLine) break;
      }
    }

    return isInLine;
  }

  public move(dx: number, dy: number) {
    const coordinateList = [this.line.from, ...this.line.midPoints, this.line.to];
    coordinateList.forEach((it) => {
      it.x += dx;
      it.y += dy;
    });
  }
}
