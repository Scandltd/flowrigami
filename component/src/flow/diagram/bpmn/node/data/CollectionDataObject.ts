import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Node from '@app/flow/diagram/bpmn/Node';
import { innerFigureStyle, previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/data/dataStyles';
import DataObj from '@app/flow/diagram/bpmn/shapes/DataObj';
import DataObjWithoutAngle from '@app/flow/diagram/bpmn/shapes/DataObjWithoutAngle';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import VerticalStrips from '@app/flow/diagram/bpmn/shapes/VerticalStrips';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import Store from '@app/flow/store/Store';


export default class CollectionDataObject extends Node {
  name = 'CollectionDataObject';

  halfHeight: number;
  halfWidth: number;
  ctx: CanvasRenderingContext2D;


  private textArea: Text;
  private dataObject: DataObj;
  private dataObjectPreview: DataObj;
  private dataObjectSelection: DataObjWithoutAngle;

  private verticalStrips: VerticalStrips;
  private verticalStripsPreview: VerticalStrips;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, halfWidth?: number, halfHeight?: number) {
    super(coordinates);
    this.halfWidth = halfWidth || 20;
    this.halfHeight = halfHeight || 30;
    this.ctx = ctx;

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');

    const dataObjParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: this.halfWidth,
      height: this.halfHeight
    };

    const dataObjPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 10,
      height: 15
    };

    const dataObjSelectionParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: this.halfWidth + 4,
      height: this.halfHeight + 4
    };

    const verticalStripsParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: this.halfWidth,
      height: this.halfHeight
    };

    const verticalStripsPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 10,
      height: 15
    };

    this.dataObject = new DataObj(canvas, tmpHookDiv, styles, dataObjParams);
    this.dataObjectPreview = new DataObj(canvas, tmpHookDiv, previewStyles, dataObjPreviewParams);
    this.dataObjectSelection = new DataObjWithoutAngle(canvas, tmpHookDiv, selectionStyle, dataObjSelectionParams);

    this.verticalStrips = new VerticalStrips(canvas, tmpHookDiv, innerFigureStyle, verticalStripsParams);
    this.verticalStripsPreview = new VerticalStrips(canvas, tmpHookDiv, innerFigureStyle, verticalStripsPreviewParams);

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + this.halfHeight + 4),
      this.halfWidth,
      this.halfHeight
    );

    this.points = [
      new AnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y - this.halfHeight), AnchorPoint.Orientation.Top),
      new AnchorPoint(ctx, new Coordinates(coordinates.x + this.halfWidth, coordinates.y), AnchorPoint.Orientation.Right),
      new AnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y + this.halfHeight), AnchorPoint.Orientation.Bottom),
      new AnchorPoint(ctx, new Coordinates(coordinates.x - this.halfWidth, coordinates.y), AnchorPoint.Orientation.Left),
    ];
  }

  public draw() {
    this.textArea.text = this.label;

    this.dataObject.isActive = this.isActive;
    this.verticalStrips.isActive = this.isActive;

    this.dataObject.isHover = this.isHover;
    this.verticalStrips.isHover = this.isHover;

    this.dataObject.draw();
    this.verticalStrips.draw();

    if (this.isActive) {
      this.dataObjectSelection.draw();
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
    this.dataObjectPreview.isHover = this.isHover;
    this.verticalStripsPreview.isHover = this.isHover;

    this.dataObjectPreview.draw();
    this.verticalStripsPreview.draw();
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInDataObject = this.dataObject.includes(coordinates.x, coordinates.y);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isInTextArea = this.textArea.includes(coordinates);

    return isInDataObject || isInConnectionPoint || isInTextArea;
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.dataObjectPreview.includes(coordinates.x, coordinates.y);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
    this.dataObject.move(dx, dy);
    this.dataObjectSelection.move(dx, dy);
    this.verticalStrips.move(dx, dy);
    this.textArea.move(dx, dy);
  }
}
