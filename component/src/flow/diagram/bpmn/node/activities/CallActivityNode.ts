import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import BpmnNode from '../../BpmnNode';
import {
  BORDER_RADIUS,
  previewStyles,
  SELECTION_MARGIN,
  selectionStyle,
  styles
} from '@app/flow/diagram/bpmn/node/activities/CallActivityNodeConstants';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';
import Store from '@app/flow/store/Store';


export default class CallActivityNode extends BpmnNode {
  public name = 'CallActivityNode';

  private textArea: Text;
  private rectangle: CanvasRectangle;
  private rectangleSelection: CanvasRectangle;
  private rectanglePreview: CanvasRectangle;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, halfWidth?: number, halfHeight?: number) {
    super(coordinates);
    const shapeHeight = halfHeight || 60;
    const activeHeight = shapeHeight + SELECTION_MARGIN;
    const shapeWidth = halfWidth || 120;
    const activeWidth = shapeWidth + SELECTION_MARGIN;

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');

    const rectangleParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeWidth,
      height: shapeHeight,
      borderRadius: BORDER_RADIUS
    };

    const rectanglePreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 60,
      height: 40,
      borderRadius: BORDER_RADIUS
    };

    const rectangleSelectionParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: activeWidth,
      height: activeHeight,
      borderRadius: BORDER_RADIUS
    };


    this.textArea = new Text(
      ctx,
      new Coordinates(coordinates.x - shapeWidth/2, coordinates.y - shapeHeight/2),
      shapeWidth/2,
      shapeHeight/2);

    this.rectangle = new CanvasRectangle(canvas, tmpHookDiv, styles, rectangleParams);
    this.rectangleSelection = new CanvasRectangle(canvas, tmpHookDiv, selectionStyle, rectangleSelectionParams);
    this.rectanglePreview = new CanvasRectangle(canvas, tmpHookDiv, previewStyles, rectanglePreviewParams);

    this.points = [
      new AnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y - shapeHeight/2), AnchorPoint.Orientation.Top),
      new AnchorPoint(ctx, new Coordinates(coordinates.x + shapeWidth/2, coordinates.y), AnchorPoint.Orientation.Right),
      new AnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y + shapeHeight/2), AnchorPoint.Orientation.Bottom),
      new AnchorPoint(ctx, new Coordinates(coordinates.x - shapeWidth/2, coordinates.y), AnchorPoint.Orientation.Left),
    ];
  }


  public draw() {
    this.textArea.text = this.label;
    this.rectangle.isActive = this.isActive;
    this.rectangle.isHover = this.isHover;

    this.rectangle.draw();

    if (this.isActive) {
      this.rectangleSelection.draw();
    }

    this.textArea.isActive = this.isActive;
    if (!this.isEditing) {
      this.textArea.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }
  }


  public drawPreview() {
    this.rectanglePreview.isHover = this.isHover;
    this.rectanglePreview.draw();
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInRectangle = this.rectangle.includes(coordinates.x, coordinates.y);
    const isInTextArea = this.textArea.includes(coordinates);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);

    return isInRectangle || isInConnectionPoint || isInTextArea;
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.rectanglePreview.includes(coordinates.x, coordinates.y);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
    this.rectangle.move(dx, dy);
    this.textArea.move(dx, dy);
    this.rectangleSelection.move(dx, dy);
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }
}
