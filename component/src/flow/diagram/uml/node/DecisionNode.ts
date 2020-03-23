import { SHAPE_LABEL_STYLE, SHAPE_SELECTION_STYLE } from '@app/flow/DefaultTheme';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Node from '@app/flow/diagram/Node';
import {
  getAnchorPoints,
  getPreviewRhombusParams,
  getRhombusParams,
  getSelectionRhombusParams,
  getTextParams,
  previewStyles,
  styles
} from '@app/flow/diagram/uml/node/DecisionNodeConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasRhombus from '@app/flow/graphics/canvas/shapes/CanvasRhombus';
import Store from '@app/flow/store/Store';


export default class DecisionNode extends Node {
  public name = UmlNodes.DecisionNode;

  public get label() { return super.label; }
  public set label(label: string) {
    super.label = label;
    this.textEditor.text = this.label;
  }

  private preview: CanvasRhombus;
  private selection: CanvasRhombus;
  private rhombus: CanvasRhombus;
  private textEditor: CanvasText;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: CoordinatePoint) {
    super(canvas, htmlLayer, params);

    this.rhombus = new CanvasRhombus(canvas, htmlLayer, styles, getRhombusParams(params));
    this.selection = new CanvasRhombus(canvas, htmlLayer, SHAPE_SELECTION_STYLE, getSelectionRhombusParams(params));
    this.preview = new CanvasRhombus(canvas, htmlLayer, previewStyles, getPreviewRhombusParams(params));

    this.textEditor = new CanvasText(canvas, htmlLayer, getTextParams(params), SHAPE_LABEL_STYLE);

    const [top, right, bottom, left] = getAnchorPoints(params);
    this.createConnectionPoints([
      new AnchorPoint(this.ctx, top, AnchorPoint.Orientation.Top),
      new AnchorPoint(this.ctx, right, AnchorPoint.Orientation.Right),
      new AnchorPoint(this.ctx, bottom, AnchorPoint.Orientation.Bottom),
      new AnchorPoint(this.ctx, left, AnchorPoint.Orientation.Left),
    ]);
  }

  public draw() {
    this.selection.isActive = this.isActive;
    this.rhombus.isActive = this.isActive;

    this.preview.isHover = this.isHover;
    this.selection.isHover = this.isHover;
    this.rhombus.isHover = this.isHover;
    // @TODO must be in setter


    this.rhombus.draw();
    if (this.isActive) {
      this.selection.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }

    // @TODO analyze this
    if (!this.isEditing) {
      this.textEditor.isActive = this.isActive;
      this.textEditor.draw();
    }
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(x: number, y: number) {
    const isInRhombus = this.rhombus.includes(x, y);
    const isInConnectionPoint = !!this.getConnectionPoint({ x, y });
    const isInTextArea = this.textEditor.includes(x, y);

    return isInRhombus || isInConnectionPoint || isInTextArea;
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    this.points.forEach(point => point.move(dx, dy));
    this.rhombus.move(dx, dy);
    this.selection.move(dx, dy);
    this.textEditor.move(dx, dy);
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
