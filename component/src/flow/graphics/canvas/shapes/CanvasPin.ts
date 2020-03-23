import Pin from '@app/flow/geometry/Pin';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { createPinPath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasPin extends CanvasShape {
  protected params: Pin;
  protected style: ShapeStyle;
  protected path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Pin) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createPinPath2D(this.params);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.path2d = createPinPath2D(this.params);
  }
}
