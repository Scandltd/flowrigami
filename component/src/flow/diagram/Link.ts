import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Shape from '@app/flow/graphics/Shape';
import nanoid from 'nanoid';


export default abstract class Link implements Shape {
  public readonly id: string;
  public points: AnchorPoint[];
  // @TODO check is this necessary
  public isOrthogonal = false;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, points: AnchorPoint[]) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = nanoid();
    this.points = points;
  }

  public abstract draw(): void;

  public abstract getDetectedPoint(coordinates: CoordinatePoint): AnchorPoint | undefined;

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;

  public abstract movePoint(point: AnchorPoint, dx: number, dy: number): void;

  public abstract movePointFinished(point: AnchorPoint): void;

  public abstract onHover(isHover: boolean): void;
}
