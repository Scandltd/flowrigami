import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import NodeExportObject from '@app/flow/exportimport/NodeExportObject';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import Store from '@app/flow/store/Store';


export default abstract class Node extends CanvasShape {
  public x: number;
  public y: number;
  public points: AnchorPoint[] = [];

  private _label: string = '';
  public get label() { return this._label; }
  public set label(value: string) { this._label = value || ''; }

  private _isEditing = false;
  public get isEditing() { return this._isEditing; }
  public set isEditing(isEditing: boolean) { this._isEditing = isEditing; }

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, { x, y }: CoordinatePoint) {
    super(canvas, htmlLayer);
    this.x = x;
    this.y = y;
  }

  public export(): NodeExportObject {
    return {
      name: this.name,
      id: this.id,
      params: {
        label: this.label,
        x: this.x,
        y: this.y
      },
    };
  };

  public import(exportObject: NodeExportObject) {
    this.id = exportObject.id;
    const { label, x, y } = exportObject.params;
    this.label = label;
    this.x = x;
    this.y = y;
  }

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
