import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';
import Shape from '@app/flow/graphics/Shape';
import nanoid from 'nanoid';


export default abstract class CanvasShape implements Shape {
  public abstract name: string;

  public id: string;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = nanoid();
  }

  public abstract draw(): void;

  public export(): ShapeExportObject {
    return {
      name: this.name,
      id: this.id,
    };
  };

  public import(object: ShapeExportObject) {
    this.id = object.id;
  }

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;
}
