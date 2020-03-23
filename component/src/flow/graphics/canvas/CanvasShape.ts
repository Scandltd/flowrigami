import Shape from '@app/flow/graphics/Shape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


export default abstract class CanvasShape implements Shape {
  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected abstract params: any;
  protected abstract style: ShapeStyle;
  protected abstract path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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

  public abstract move(dx: number, dy: number): void;

  public setStyle(shapeStyle: ShapeStyle) {
    this.style = shapeStyle;
  }
}
