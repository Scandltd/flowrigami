import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import NodeParams from '@app/flow/diagram/NodeParams';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Shape from '@app/flow/graphics/Shape';
import Store from '@app/flow/store/Store';
import nanoid from 'nanoid';


export default abstract class Node implements Shape {
  public abstract name: string;
  public readonly id: string;

  public x: number;
  public y: number;
  public points: AnchorPoint[] = [];

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  private _label: string = '';
  public get label() { return this._label; }
  public set label(value: string) { this._label = value || ''; }

  private _isEditing = false;
  public get isEditing() { return this._isEditing; }
  public set isEditing(isEditing: boolean) { this._isEditing = isEditing; }

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: NodeParams) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = params.id || nanoid();
    this._label = params.label || '';
    this.x = params.x;
    this.y = params.y;
  }

  public getParams(): NodeParams {
    return {
      id: this.id,
      label: this.label,
      x: this.x,
      y: this.y
    };
  };

  public abstract draw(): void;

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;

  public getConnectionPoint(coordinates: CoordinatePoint) {
    return this.points.find(point => point.includes(coordinates));
  }

  protected createConnectionPoints(points: AnchorPoint[]) {
    points.forEach((it) => { it.owner = this; });
    this.points = points;
  }

  public renderHtml(parent: HTMLElement, store: Store) {};

  public abstract drawPreview(): void;

  public abstract previewIncludes(coordinates: CoordinatePoint): boolean;
}
