import Pin from '@app/flow/geometry/Pin';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { createPinPath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasPin extends CanvasShape {
  public name = 'CanvasPin';

  private params: Pin;
  private style: ShapeStyle;
  private path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Pin) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createPinPath2D(this.params);
  }

  public draw() {
    drawPath2D(this.ctx, this.path2d, this.getCurrentStyle());
  }

  private getCurrentStyle() {
    const style = this.style;
    return this.isActive ? (style.active || style) : (this.isHover ? (style.hover || style) : style);
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.path2d, x, y);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.path2d = createPinPath2D(this.params);
  }

  public setStyle(shapeStyle: ShapeStyle) {
    this.style = shapeStyle;
  }
}
