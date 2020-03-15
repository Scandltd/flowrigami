import { SHAPE_SELECTION_STYLE } from '@app/flow/DefaultTheme';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Node from '@app/flow/diagram/Node';
import {
  ACTIVITY_LABEL_STYLE,
  getAnchorPoints,
  getPreviewRectangleParams,
  getRectangleParams,
  getSelectionRectangleParams,
  getTextParams,
  previewStyles,
  styles,
} from '@app/flow/diagram/uml/node/ActivityNodeConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';
import Store from '@app/flow/store/Store';


export default class ActivityNode extends Node {
  public name = UmlNodes.ActivityNode;

  public get label() { return super.label; }
  public set label(label: string) {
    super.label = label;
    this.textEditor.setText(super.label);
  }

  private rectangle: CanvasRectangle;
  private selection: CanvasRectangle;
  private preview: CanvasRectangle;

  private textEditor: CanvasText;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: CoordinatePoint) {
    super(canvas, htmlLayer, params);

    this.rectangle = new CanvasRectangle(canvas, htmlLayer, styles, getRectangleParams(params));
    this.selection = new CanvasRectangle(canvas, htmlLayer, SHAPE_SELECTION_STYLE, getSelectionRectangleParams(params));
    this.preview = new CanvasRectangle(canvas, htmlLayer, previewStyles, getPreviewRectangleParams(params));

    this.textEditor = new CanvasText(canvas, htmlLayer, getTextParams(params), ACTIVITY_LABEL_STYLE);

    const [top, right, bottom, left] = getAnchorPoints(params);
    this.createConnectionPoints([
      new AnchorPoint(this.ctx, top, AnchorPoint.Orientation.Top),
      new AnchorPoint(this.ctx, right, AnchorPoint.Orientation.Right),
      new AnchorPoint(this.ctx, bottom, AnchorPoint.Orientation.Bottom),
      new AnchorPoint(this.ctx, left, AnchorPoint.Orientation.Left),
    ]);
  }

  public draw() {
    this.rectangle.isActive = this.isActive;
    this.rectangle.isHover = this.isHover;

    this.rectangle.draw();
    if (this.isActive) {
      this.selection.draw();
    }

    if (!this.isEditing) {
      this.textEditor.isActive = this.isActive;
      this.textEditor.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(x: number, y: number) {
    const isInRectangle = this.rectangle.includes(x, y);
    const isInConnectionPoint = !!this.getConnectionPoint({ x, y });

    return isInRectangle || isInConnectionPoint;
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    this.rectangle.move(dx, dy);
    this.selection.move(dx, dy);
    this.textEditor.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textEditor.renderHtml(parent, store, this.id, this.isEditing);
  }

  public drawPreview() {
    this.preview.isHover = this.isHover;
    this.preview.draw();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.preview.includes(coordinates.x, coordinates.y);
  }
}
