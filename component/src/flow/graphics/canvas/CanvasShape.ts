import ShapeExportObject from '@app/flow/exportimport/ShapeExportObject';
import Shape from '@app/flow/graphics/Shape';
import nanoid from 'nanoid';


export default abstract class CanvasShape implements Shape {
  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  public abstract name: string;
  public id: string;

  private p_isActive: boolean = false;

  public get isActive() {
    return this.p_isActive;
  }

  public set isActive(isActive: boolean) {
    this.p_isActive = isActive;
  }

  public isHover: boolean = false;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = nanoid();
  }

  public abstract draw(): void;

  public export(): ShapeExportObject {
    return {
      id: this.id,
      name: this.name,
    };
  };

  public import(object: ShapeExportObject) {
    this.id = object.id;
    this.name = object.name;
  }

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;
}
