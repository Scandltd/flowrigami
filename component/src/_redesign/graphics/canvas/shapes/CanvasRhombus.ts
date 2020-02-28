import Rhombus, { RhombusParams } from '@app/flow/geometry/shapes/Rhombus';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { calculateRoundingShift } from '@app/flow/utils/MathUtils';
import { createClosedPath } from '@app/flow/utils/Path2DUtils';


export default class CanvasRhombus extends CanvasShape {
  public name = 'CanvasRhombus';

  private rhombus: Rhombus;
  private shapeStyle: ShapeStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, rhombusParams: RhombusParams, shapeStyle: ShapeStyle) {
    super(canvas, htmlLayer);
    this.rhombus = new Rhombus(rhombusParams);
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.shapeStyle);
  }

  private createPath2D() {
    const x = this.rhombus.x;
    const y = this.rhombus.y;
    const halfWidth = this.rhombus.width/2;
    const halfHeight = this.rhombus.height/2;

    const top = { x: x + halfHeight, y: y };
    const right = { x: x, y: y + halfWidth };
    const bottom = { x: x - halfHeight, y: y };
    const left = { x: x, y: y - halfWidth };

    const borderRadius = this.rhombus.borderRadius;
    if (borderRadius) {
      const roundingShiftHorizontal = calculateRoundingShift(left, bottom, top, borderRadius);
      const roundingShiftVertical = calculateRoundingShift(top, left, right, borderRadius);

      top.x += roundingShiftVertical;
      right.y += roundingShiftHorizontal;
      bottom.x -= roundingShiftVertical;
      left.y -= roundingShiftHorizontal;
    }

    return createClosedPath([top, right, bottom, left], borderRadius);
  };

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  public move(dx: number, dy: number) {
    this.rhombus.x += dx;
    this.rhombus.y += dy;
  }
}
