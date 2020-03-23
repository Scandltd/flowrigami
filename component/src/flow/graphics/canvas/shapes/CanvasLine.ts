import Line from '@app/flow/geometry/Line';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { belongsToLine, belongsToRectangle } from '@app/flow/utils/MathUtils';
import { createLinePath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasLine extends CanvasShape {
  protected params: Line;
  protected style: ShapeStyle;
  protected path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Line) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createLinePath2D(this.params);
  }

  public includes(x: number, y: number) {
    let isInLine = false;

    const coordinateList = [this.params.from, ...this.params.midPoints, this.params.to];

    const length = coordinateList.length;
    if (length > 1) {
      for (let i = 1; i < length; i++) {
        const from = coordinateList[i - 1];
        const to = coordinateList[i];

        const pointBelongsToLine = belongsToLine({ x, y }, from, to);
        if (pointBelongsToLine) {
          const rectangle = {
            x: 0.5*(from.x + to.x),
            y: 0.5*(from.y + to.y),
            width: Math.max(Math.abs(from.x - to.x), 10),
            height: Math.max(Math.abs(from.y - to.y), 10),
          };

          isInLine = belongsToRectangle({ x, y }, rectangle);
        }

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
