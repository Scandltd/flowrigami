import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import { innerFigureStyle, previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/data/dataStyles';
import Arrow from '@app/flow/diagram/bpmn/shapes/Arrow';
import DataObj from '@app/flow/diagram/bpmn/shapes/DataObj';
import DataObjWithoutAngle from '@app/flow/diagram/bpmn/shapes/DataObjWithoutAngle';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import Store from '@app/flow/store/Store';
import BpmnAnchorPoint from '../../BpmnAnchorPoint';
import BpmnNode from '../../BpmnNode';


export default class DataInput extends BpmnNode {
  name = 'DataInput';

  halfHeight: number;
  halfWidth: number;
  ctx: CanvasRenderingContext2D;

  private textArea: Text;
  private dataObject: DataObj;
  private dataObjectPreview: DataObj;
  private dataObjectSelection: DataObjWithoutAngle;

  private arrow: Arrow;
  private arrowPreview: Arrow;

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

    const arrowParams = {
      x: coordinates.x - this.halfWidth*0.4,
      y: coordinates.y - this.halfHeight + this.halfWidth*0.5,
      width: this.halfWidth*0.4,
      height: this.halfWidth*0.3
    };

    const arrowPreviewParams = {
      x: coordinates.x - 4,
      y: coordinates.y - 9,
      width: 3,
      height: 3
    };

    this.dataObject = new DataObj(canvas, tmpHookDiv, styles, dataObjParams);
    this.dataObjectPreview = new DataObj(canvas, tmpHookDiv, previewStyles, dataObjPreviewParams);
    this.dataObjectSelection = new DataObjWithoutAngle(canvas, tmpHookDiv, selectionStyle, dataObjSelectionParams);

    this.arrow = new Arrow(canvas, tmpHookDiv, innerFigureStyle, arrowParams);
    this.arrowPreview = new Arrow(canvas, tmpHookDiv, innerFigureStyle, arrowPreviewParams);

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + this.halfHeight + 4),
      this.halfWidth,
      this.halfHeight
    );

    this.points = [
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y - this.halfHeight), BpmnAnchorPoint.Orientation.Top),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x + this.halfWidth, coordinates.y), BpmnAnchorPoint.Orientation.Right),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x, coordinates.y + this.halfHeight), BpmnAnchorPoint.Orientation.Bottom),
      new BpmnAnchorPoint(ctx, new Coordinates(coordinates.x - this.halfWidth, coordinates.y), BpmnAnchorPoint.Orientation.Left),
    ];
  }

  public draw() {
    this.textArea.text = this.label;

    this.dataObject.isActive = this.isActive;
    this.arrow.isActive = this.isActive;

    this.dataObject.isHover = this.isHover;
    this.arrow.isHover = this.isHover;

    this.dataObject.draw();
    this.arrow.draw();

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
    this.arrowPreview.isHover = this.isHover;
    this.dataObjectPreview.draw();
    this.arrowPreview.draw();
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
    this.arrow.move(dx, dy);
    this.dataObjectSelection.move(dx, dy);
    this.textArea.move(dx, dy);
  }
}
