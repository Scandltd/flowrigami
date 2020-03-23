import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import {
  BORDER_RADIUS,
  innerFigureStyle,
  previewStyles,
  SELECTION_MARGIN,
  selectionStyle,
  styles
} from '@app/flow/diagram/bpmn/node/gateways/ComplexNodeConstants';
import Asterisk from '@app/flow/diagram/bpmn/shapes/Asterisk';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import CanvasRhombus from '@app/flow/graphics/canvas/shapes/CanvasRhombus';
import Store from '@app/flow/store/Store';
import BpmnAnchorPoint from '../../BpmnAnchorPoint';
import BpmnNode from '../../BpmnNode';


export default class ComplexNode extends BpmnNode {
  name = 'ComplexNode';

  private rhombus: CanvasRhombus;
  private rhombusPreview: CanvasRhombus;
  private rhombusSelection: CanvasRhombus;

  private asterisk: Asterisk;
  private asteriskPreview: Asterisk;

  private textArea: Text;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, width?: number, height?: number) {
    super(coordinates);
    const shapeHeight = height || 60;
    const shapeWidth = width || 60;

    const topCorner = new Coordinates(coordinates.x, coordinates.y - shapeHeight/2);
    const rightCorner = new Coordinates(coordinates.x + shapeWidth/2, coordinates.y);
    const bottomCorner = new Coordinates(coordinates.x, coordinates.y + shapeHeight/2);
    const leftCorner = new Coordinates(coordinates.x - shapeWidth/2, coordinates.y);

    this.points = [
      new BpmnAnchorPoint(ctx, leftCorner, BpmnAnchorPoint.Orientation.Left),
      new BpmnAnchorPoint(ctx, topCorner, BpmnAnchorPoint.Orientation.Top),
      new BpmnAnchorPoint(ctx, rightCorner, BpmnAnchorPoint.Orientation.Right),
      new BpmnAnchorPoint(ctx, bottomCorner, BpmnAnchorPoint.Orientation.Bottom)
    ];

    const rhombusPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS
    };

    const rhombusParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeWidth,
      height: shapeHeight,
      borderRadius: BORDER_RADIUS,
    };

    const rhombusSelectionParams = {
      ...rhombusParams,
      width: shapeHeight + SELECTION_MARGIN,
      height: shapeWidth + SELECTION_MARGIN,
    };

    const asteriskParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeWidth/2,
      height: shapeHeight/2
    };

    const previewAsteriskParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 24,
      height: 24
    };


    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');
    this.rhombus = new CanvasRhombus(canvas, tmpHookDiv, styles, rhombusParams);
    this.rhombusPreview = new CanvasRhombus(canvas, tmpHookDiv, previewStyles, rhombusPreviewParams);
    this.rhombusSelection = new CanvasRhombus(canvas, tmpHookDiv, selectionStyle, rhombusSelectionParams);
    this.asterisk = new Asterisk(canvas, tmpHookDiv, innerFigureStyle, asteriskParams);
    this.asteriskPreview = new Asterisk(canvas, tmpHookDiv, innerFigureStyle, previewAsteriskParams);

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + shapeHeight/2),
      shapeWidth/2,
      shapeHeight/2
    );
  }

  public draw() {
    this.textArea.text = this.label;

    this.rhombus.isActive = this.isActive;
    this.rhombusSelection.isActive = this.isActive;
    this.asterisk.isActive = this.isActive;
    this.textArea.isActive = this.isActive;

    this.rhombus.isHover = this.isHover;
    this.rhombusSelection.isHover = this.isHover;
    this.asterisk.isHover = this.isHover;

    this.rhombus.draw();
    this.asterisk.draw();
    if (this.isActive) {
      this.rhombusSelection.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }

    if (!this.isEditing) {
      this.textArea.draw();
    }
  }

  public drawPreview() {
    this.rhombusPreview.isHover = this.isHover;
    this.asteriskPreview.isHover = this.isHover;
    this.rhombusPreview.draw();
    this.asteriskPreview.draw();
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.rhombusPreview.includes(coordinates.x, coordinates.y);
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInRhombus = this.rhombus.includes(coordinates.x, coordinates.y);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isTextAreaIncludes = this.textArea.includes(coordinates);

    return isInRhombus || isInConnectionPoint || isTextAreaIncludes;
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.rhombus.move(dx, dy);
    this.asterisk.move(dx, dy);
    this.rhombusSelection.move(dx, dy);
    this.textArea.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }
}
