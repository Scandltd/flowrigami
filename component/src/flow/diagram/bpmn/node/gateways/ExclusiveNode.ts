import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Node from '@app/flow/diagram/bpmn/Node';
import {
  BORDER_RADIUS,
  innerFigureStyle,
  previewStyles,
  SELECTION_MARGIN,
  selectionStyle,
  styles
} from '@app/flow/diagram/bpmn/node/gateways/ExclusiveNodeConstants';
import Cross from '@app/flow/diagram/bpmn/shapes/Cross';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import CanvasRhombus from '@app/flow/graphics/canvas/shapes/CanvasRhombus';
import Store from '@app/flow/store/Store';


export default class ExclusiveNode extends Node {
  name = 'ExclusiveNode';

  private rhombus: CanvasRhombus;
  private rhombusPreview: CanvasRhombus;
  private rhombusSelection: CanvasRhombus;

  private cross: Cross;
  private crossPreview: Cross;

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
      new AnchorPoint(ctx, leftCorner, AnchorPoint.Orientation.Left),
      new AnchorPoint(ctx, topCorner, AnchorPoint.Orientation.Top),
      new AnchorPoint(ctx, rightCorner, AnchorPoint.Orientation.Right),
      new AnchorPoint(ctx, bottomCorner, AnchorPoint.Orientation.Bottom)
    ];

    const rhombusParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeWidth,
      height: shapeHeight,
      borderRadius: BORDER_RADIUS,
    };

    const rhombusPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS
    };

    const rhombusSelectionParams = {
      ...rhombusParams,
      width: shapeHeight + SELECTION_MARGIN,
      height: shapeWidth + SELECTION_MARGIN,
    };

    const crossParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeWidth*0.2,
      height: shapeHeight*0.2,
    };

    const crossPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 8,
      height: 8,
    };

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');
    this.rhombus = new CanvasRhombus(canvas, tmpHookDiv, styles, rhombusParams);
    this.rhombusPreview = new CanvasRhombus(canvas, tmpHookDiv, previewStyles, rhombusPreviewParams);
    this.rhombusSelection = new CanvasRhombus(canvas, tmpHookDiv, selectionStyle, rhombusSelectionParams);

    this.cross = new Cross(canvas, tmpHookDiv, innerFigureStyle, crossParams);
    this.crossPreview = new Cross(canvas, tmpHookDiv, innerFigureStyle, crossPreviewParams);

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + shapeHeight/2),
      shapeWidth/2,
      shapeHeight/2
    );
  }

  public draw() {
    this.textArea.text = this.label;

    this.rhombus.isActive = this.isActive;
    this.rhombusSelection.isActive = this.isActive;
    this.textArea.isActive = this.isActive;
    this.cross.isActive = this.isActive;

    this.rhombus.isHover = this.isHover;
    this.rhombusSelection.isHover = this.isHover;
    this.cross.isHover = this.isHover;

    this.rhombus.draw();
    this.cross.draw();
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
    this.crossPreview.isHover = this.isHover;

    this.rhombusPreview.draw();
    this.crossPreview.draw();
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.rhombusPreview.includes(coordinates.x, coordinates.y);
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

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.rhombus.move(dx, dy);
    this.rhombusSelection.move(dx, dy);
    this.cross.move(dx, dy);
    this.textArea.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }
}
