import Rectangle from '@app/flow/geometry/Rectangle';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { createRectanglePath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasRectangle extends CanvasShape {
  protected params: Rectangle;
  protected style: ShapeStyle;
  protected path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Rectangle) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createRectanglePath2D(this.params);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.path2d = createRectanglePath2D(this.params);
  }
}
