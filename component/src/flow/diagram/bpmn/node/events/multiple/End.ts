import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import { innerFigureStyle, previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/events/eventsStyles/EndConstants';
import Pentagon from '@app/flow/diagram/bpmn/shapes/Pentagon';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import Store from '@app/flow/store/Store';
import BpmnAnchorPoint from '../../../BpmnAnchorPoint';
import BpmnNode from '../../../BpmnNode';


export default class End extends BpmnNode {
  public name = 'End';

  private circle: CanvasCircle;
  private circlePreview: CanvasCircle;
  private circleSelection: CanvasCircle;

  private pentagon: Pentagon;
  private pentagonPreview: Pentagon;

  private textArea: Text;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, radius?: number) {
    super(coordinates);
    const shapeRadius = radius || 20;
    const activeRadius = shapeRadius + 3;

    const circleParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: shapeRadius
    };

    const circlePreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: shapeRadius - 2
    };

    const circleSelectionParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: activeRadius
    };

    const pentagonParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeRadius*0.6,
      height: shapeRadius*0.6,
    };

    const pentagonPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 11,
      height: 11,
    };

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');

    this.circle = new CanvasCircle(canvas, tmpHookDiv, styles, circleParams);
    this.circlePreview = new CanvasCircle(canvas, tmpHookDiv, previewStyles, circlePreviewParams);
    this.circleSelection = new CanvasCircle(canvas, tmpHookDiv, selectionStyle, circleSelectionParams);

    this.pentagon = new Pentagon(canvas, tmpHookDiv, innerFigureStyle, pentagonParams);
    this.pentagonPreview = new Pentagon(canvas, tmpHookDiv, innerFigureStyle, pentagonPreviewParams);

    this.textArea = new Text(ctx, new Coordinates(coordinates.x , coordinates.y + activeRadius + 2), shapeRadius, shapeRadius);

    this.points = [
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x - shapeRadius, coordinates.y), BpmnAnchorPoint.Orientation.Left),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y - shapeRadius), BpmnAnchorPoint.Orientation.Top),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x + shapeRadius, coordinates.y), BpmnAnchorPoint.Orientation.Right),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y + shapeRadius), BpmnAnchorPoint.Orientation.Bottom),
    ];
  }

  public draw() {
    this.textArea.text = this.label;
    this.circle.isActive = this.isActive;
    this.pentagon.isActive = this.isActive;

    this.circle.isHover = this.isHover;
    this.pentagon.isHover = this.isHover;

    this.circle.draw();
    this.pentagon.draw();

    if (this.isActive) {
      this.circleSelection.draw();
    }

    if (!this.isEditing) {
      this.textArea.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawConnectionPoints();
    }
  }


  public drawPreview() {
    this.circlePreview.isHover = this.isHover;
    this.pentagonPreview.isHover = this.isHover;

    this.circlePreview.draw();
    this.pentagonPreview.draw();
  }

  private drawConnectionPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInCircle = this.circle.includes(coordinates.x, coordinates.y);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isTextAreaIncludes = this.textArea.includes(coordinates);

    return isInCircle || isInConnectionPoint || isTextAreaIncludes;
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.circlePreview.includes(coordinates.x, coordinates.y);
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.circle.move(dx, dy);
    this.circleSelection.move(dx, dy);
    this.pentagon.move(dx, dy);
    this.textArea.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }
}
