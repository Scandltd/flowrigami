import Shape from '@app/flow/graphics/Shape';


export default abstract class BpmnCanvasShape implements Shape {
  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public abstract draw(): void;

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;
}
