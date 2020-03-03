import BpmnNode from '../../BpmnNode';
import { previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/conversations/CallConversationStyles';
import Hexagon from '@app/flow/diagram/bpmn/shapes/Hexagon';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import Store from '@app/flow/store/Store';


export default class CallConversation extends BpmnNode {
  name = 'CallConversation';

  ctx: CanvasRenderingContext2D;

  borderLength: number;

  private textArea: Text;
  private hexagon: Hexagon;
  private hexagonPreview: Hexagon;
  private hexagonSelection: Hexagon;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, borderLength?: number) {
    super(coordinates);
    this.borderLength = borderLength || 30;
    this.ctx = ctx;

    const hexagonParams = {
      x: coordinates.x,
      y: coordinates.y,
      borderLength: this.borderLength
    };

    const hexagonPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      borderLength: this.borderLength - 6
    };

    const hexagonSelectionParams = {
      x: coordinates.x,
      y: coordinates.y,
      borderLength: this.borderLength + 4
    };

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');

    this.hexagon = new Hexagon(canvas, tmpHookDiv, styles, hexagonParams);
    this.hexagonPreview = new Hexagon(canvas, tmpHookDiv, previewStyles, hexagonPreviewParams);
    this.hexagonSelection = new Hexagon(canvas, tmpHookDiv, selectionStyle, hexagonSelectionParams);

    this.textArea = new Text(ctx, new Coordinates(this.coordinates.x, this.coordinates.y + this.borderLength*Math.sqrt(3)/2 + 4),
      this.borderLength,
      this.borderLength*Math.sqrt(3)/2
    );
  }


  public draw() {
    this.textArea.text = this.label;
    this.hexagon.isActive = this.isActive;
    this.hexagon.isHover = this.isHover;
    this.hexagon.draw();

    if (this.isActive) {
      this.hexagonSelection.draw();
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
    this.hexagonPreview.isHover = this.isHover;
    this.hexagonPreview.draw();
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInHexagon = this.hexagon.includes(coordinates.x, coordinates.y);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isInTextArea = this.textArea.includes(coordinates);

    return isInHexagon || isInConnectionPoint || isInTextArea;
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.hexagonPreview.includes(coordinates.x, coordinates.y);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
    this.hexagon.move(dx, dy);
    this.hexagonSelection.move(dx, dy);
    this.textArea.move(dx, dy);
  }
}
