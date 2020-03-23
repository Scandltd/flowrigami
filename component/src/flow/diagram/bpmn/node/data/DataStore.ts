import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import { previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/data/dataStyles';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import Store from '@app/flow/store/Store';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';
import BpmnAnchorPoint from '../../BpmnAnchorPoint';
import BpmnNode from '../../BpmnNode';


export default class DataStore extends BpmnNode {
  name = 'DataStore';

  private textArea: Text;
  halfHeight: number;
  halfWidth: number;
  ctx: CanvasRenderingContext2D;


  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, halfWidth?: number, halfHeight?: number) {
    super(coordinates);
    this.halfHeight = halfHeight || 20;
    this.halfWidth = halfWidth || 40;
    this.ctx = ctx;

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + this.halfHeight + 12),
      this.halfWidth,
      this.halfHeight + 16
    );


    this.points = [
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y - this.halfHeight - 8), BpmnAnchorPoint.Orientation.Top),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x + this.halfWidth, coordinates.y), BpmnAnchorPoint.Orientation.Right),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y + this.halfHeight + 8), BpmnAnchorPoint.Orientation.Bottom),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x - this.halfWidth, coordinates.y), BpmnAnchorPoint.Orientation.Left),
    ];
  }

  public draw() {
    this.textArea.text = this.label;

    drawPath2D(this.ctx, this.createPath2D(this.halfWidth, this.halfHeight), this.getShapeStyles(styles));
    drawPath2D(this.ctx, this.createStripsPath2D(this.halfWidth, this.halfHeight), this.getShapeStyles(styles));

    if (this.isActive) {
      drawPath2D(this.ctx, this.createPath2D(this.halfWidth + 4, this.halfHeight + 4), this.getShapeStyles(selectionStyle));
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }

    if (!this.isEditing) {
      this.textArea.draw();
    }
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }

  public drawPreview() {
    drawPath2D(this.ctx, this.createPath2D(20, 10), this.getShapeStyles(previewStyles));
    drawPath2D(this.ctx, this.createStripsPath2D(20, 10), this.getShapeStyles(previewStyles));
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInDataStore = this.ctx.isPointInPath(this.createPath2D(this.halfWidth, this.halfHeight), coordinates.x, coordinates.y,);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isInTextArea = this.textArea.includes(coordinates);

    return isInDataStore || isInConnectionPoint || isInTextArea;
  }


  public previewIncludes(coordinates: Coordinates) {
    return this.ctx.isPointInPath(this.createPath2D(20, 10), coordinates.x, coordinates.y);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
    this.textArea.move(dx, dy);
  }

  private getShapeStyles(styles: any) {
    const shapeStyle = styles;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  private createPath2D(halfWidth: number, halfHeight: number) {
    const path = new Path2D();
    path.moveTo(this.coordinates.x - halfWidth, this.coordinates.y + halfHeight);
    path.lineTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight);
    path.bezierCurveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight - 10,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight - 10,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight);
    path.lineTo(this.coordinates.x + halfWidth, this.coordinates.y + halfHeight);
    path.bezierCurveTo(this.coordinates.x + halfWidth, this.coordinates.y + halfHeight + 10,
      this.coordinates.x - halfWidth, this.coordinates.y + halfHeight + 10,
      this.coordinates.x - halfWidth, this.coordinates.y + halfHeight);
    return path;
  }

  private createStripsPath2D(halfWidth: number, halfHeight: number) {
    const path = new Path2D();
    path.moveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight);
    path.bezierCurveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight + 10,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight + 10,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight);

    path.moveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight + 3);
    path.bezierCurveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight + 13,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight + 13,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight + 3);
    path.moveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight + 6);
    path.bezierCurveTo(this.coordinates.x - halfWidth, this.coordinates.y - halfHeight + 16,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight + 16,
      this.coordinates.x + halfWidth, this.coordinates.y - halfHeight + 6);
    return path;
  }
}
