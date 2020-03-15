import Line from '@app/flow/geometry/Line';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { areCoordinatesInRectangle, areCoordinatesOnInfiniteLine } from '@app/flow/utils/MathUtils';
import { createLinePath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasLine extends CanvasShape {
  public name = 'CanvasLine';

  private params: Line;
  private style: ShapeStyle;
  private path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Line) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createLinePath2D(this.params);
  }

  public draw() {
    drawPath2D(this.ctx, this.path2d, this.getCurrentStyle());
  }

  private getCurrentStyle() {
    const shapeStyle = this.style;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    let isInLine = false;

    const coordinateList = [this.params.from, ...this.params.midPoints, this.params.to];

    const length = coordinateList.length;
    if (length > 1) {
      for (let i = 1; i < length; i++) {
        const from = coordinateList[i - 1];
        const to = coordinateList[i];

        isInLine = areCoordinatesInRectangle({ x, y }, from, to) && areCoordinatesOnInfiniteLine({ x, y }, from, to);
        if (isInLine) break;
      }
    }

    return isInLine;
  }

  public move(dx: number, dy: number) {
    const coordinateList = [this.params.from, ...this.params.midPoints, this.params.to];
    coordinateList.forEach((it) => {
      it.x += dx;
      it.y += dy;
    });

    this.path2d = createLinePath2D(this.params);
  }

  public updateParams(lineParams: Line) {
    this.params = { ...this.params, ...lineParams };

    this.path2d = createLinePath2D(this.params);
  }
}
