import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Node from '@app/flow/diagram/Node';
import { BORDER_RADIUS, styles } from '@app/flow/diagram/uml/node/ForkJoinConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';


export default class VerticalForkJoinNode extends Node {
  public name = UmlNodes.VerticalForkJoinNode;

  private rectanglePreview: CanvasRectangle;
  private rectangle: CanvasRectangle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, coordinates: CoordinatePoint, halfWidth?: number, halfHeight?: number) {
    super(canvas, htmlLayer, coordinates);
    const shapeHalfHeight = halfHeight || 40;
    const shapeHalfWidth = halfWidth || 3;

    const rectangleParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeHalfWidth*2,
      height: shapeHalfHeight*2,
      borderRadius: BORDER_RADIUS,
    };

    const rectanglePreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeHalfWidth*2,
      height: 50,
      borderRadius: BORDER_RADIUS,
    };

    this.rectangle = new CanvasRectangle(canvas, htmlLayer, styles, rectangleParams);
    this.rectanglePreview = new CanvasRectangle(canvas, htmlLayer, styles, rectanglePreviewParams);

    this.createConnectionPoints([
      new AnchorPoint(this.ctx, { x: coordinates.x, y: coordinates.y - shapeHalfHeight*3/4 }, AnchorPoint.Orientation.LeftRight),
      new AnchorPoint(this.ctx, { x: coordinates.x, y: coordinates.y }, AnchorPoint.Orientation.LeftRight),
      new AnchorPoint(this.ctx, { x: coordinates.x, y: coordinates.y + shapeHalfHeight*3/4 }, AnchorPoint.Orientation.LeftRight),
    ]);
  }

  public draw() {
    this.rectangle.isHover = this.isHover;
    this.rectangle.isActive = this.isActive;
    this.rectangle.draw();

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
    this.points.forEach(point => point.move(dx, dy));
    this.rectangle.move(dx, dy);
    this.rectanglePreview.move(dx, dy);
  }

  public drawPreview() {
    this.rectanglePreview.draw();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.rectanglePreview.includes(coordinates.x, coordinates.y);
  }
}
