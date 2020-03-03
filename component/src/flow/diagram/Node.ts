import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import NodeExportObject from '@app/flow/exportimport/NodeExportObject';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import Store from '@app/flow/store/Store';
import nanoid from 'nanoid';


export default abstract class Node extends CanvasShape {
  public x: number;
  public y: number;
  public points: AnchorPoint[] = [];

  private p_isEditing = false;
  private _label: string = '';

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, { x, y }: CoordinatePoint) {
    super(canvas, htmlLayer);
    this.id = nanoid();
    this.x = x;
    this.y = y;
  }

  public export(): NodeExportObject {
    return {
      id: this.id,
      name: this.name,
      label: this.label,
      params: { x: this.x, y: this.y },
    };
  };

  public import(exportObject: NodeExportObject) {
    this.id = exportObject.id;
    this.name = exportObject.name;
    this.setLabel(exportObject.label);
  }

  public getConnectionPoint(coordinates: CoordinatePoint) {
    return this.points.find(point => point.includes(coordinates));
  }

  public get isEditing() {
    return this.p_isEditing;
  }

  public setEditing(isEditing: boolean) {
    this.p_isEditing = isEditing;
  }

  public get label() {
    return this._label || '';
  }

  public setLabel(label: string = '') {
    this._label = label;
  }

  public renderHtml(parent: HTMLElement, store: Store) {};

  public abstract drawPreview(): void;

  public abstract previewIncludes(coordinates: CoordinatePoint): boolean;
}
