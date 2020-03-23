import { SHAPE_LABEL_STYLE, SHAPE_SELECTION_STYLE } from '@app/flow/DefaultTheme';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Node from '@app/flow/diagram/Node';
import {
  dotPreviewStyle,
  dotStyle,
  getAnchorPoints,
  getCircleParams,
  getCirclePreviewParams,
  getCircleSelectionParams,
  getDotParams,
  getDotPreviewParams,
  getTextParams,
  previewStyles,
  styles
} from '@app/flow/diagram/uml/node/EndNodeConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import Store from '@app/flow/store/Store';


export default class EndNode extends Node {
  public name = UmlNodes.EndNode;

  public get label() { return super.label; }
  public set label(label: string) {
    super.label = label;
    this.textEditor.text = this.label;
  }

  private circle: CanvasCircle;
  private textEditor: CanvasText;

  private circleSelection: CanvasCircle;
  private circlePreview: CanvasCircle;
  private dot: CanvasCircle;
  private dotPreview: CanvasCircle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: CoordinatePoint) {
    super(canvas, htmlLayer, params);

    this.circle = new CanvasCircle(canvas, htmlLayer, styles, getCircleParams(params));
    this.dot = new CanvasCircle(canvas, htmlLayer, dotStyle, getDotParams(params));
    this.circleSelection = new CanvasCircle(canvas, htmlLayer, SHAPE_SELECTION_STYLE, getCircleSelectionParams(params));
    this.circlePreview = new CanvasCircle(canvas, htmlLayer, previewStyles, getCirclePreviewParams(params));
    this.dotPreview = new CanvasCircle(canvas, htmlLayer, dotPreviewStyle, getDotPreviewParams(params));

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
    this.circle.isHover = this.isHover;
    this.circle.isActive = this.isActive;
    this.textEditor.isActive = this.isActive;

    if (this.isActive) {
      this.circleSelection.draw();
    }
    this.circle.draw();
    this.dot.draw();

    if (!this.isEditing) {
      this.textEditor.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawConnectionPoints();
    }
  }

  private drawConnectionPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(x: number, y: number) {
    const isInCircle = this.circle.includes(x, y);
    const isInTextArea = this.textEditor.includes(x, y);
    const isInConnectionPoint = !!this.getConnectionPoint({ x, y });

    return isInCircle || isInConnectionPoint || isInTextArea;
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.points.forEach(point => point.move(dx, dy));
    this.textEditor.move(dx, dy);
    this.circle.move(dx, dy);
    this.dot.move(dx, dy);
    this.circleSelection.move(dx, dy);
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textEditor.renderHtml(parent, store, this.id, this.isEditing);
  }

  public drawPreview() {
    this.circlePreview.isHover = this.isHover;
    this.dotPreview.isHover = this.isHover;
    this.circlePreview.draw();
    this.dotPreview.draw();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.circlePreview.includes(coordinates.x, coordinates.y);
  }
}
