import Rectangle from '@app/flow/geometry/Rectangle';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import { createRectanglePath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasRectangle extends CanvasShape {
  public name = 'CanvasRectangle';

  private params: Rectangle;
  private style: ShapeStyle;
  private path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Rectangle) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createRectanglePath2D(this.params);
  }

  public draw() {
    drawPath2D(this.ctx, this.path2d, this.getCurrentStyle());
  }

  private getCurrentStyle() {
    const shapeStyle = this.style;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.path2d, x, y);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.path2d = createRectanglePath2D(this.params);
  }
}
