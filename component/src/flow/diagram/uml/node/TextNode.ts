import { SHAPE_LABEL_STYLE } from '@app/flow/DefaultTheme';
import { SHAPE_LABEL_COLOR } from '@app/flow/DefaultThemeConstants';
import Node from '@app/flow/diagram/Node';
import { getPreviewRectangleParams, getRectangleParams, previewStyles, styles } from '@app/flow/diagram/uml/node/TextNodeConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';
import TextParams from '@app/flow/graphics/TextParams';
import Store from '@app/flow/store/Store';


export default class TextNode extends Node {
  public name = UmlNodes.TextNode;

  public get label() { return super.label; }
  public set label(label: string) {
    super.label = label;
    this.textEditor.setText(super.label);

    this.rectangle = this.createHoverRectangle();
  }

  private textEditor: CanvasText;
  private rectangle: CanvasRectangle;
  private rectanglePreview: CanvasRectangle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: TextParams) {
    super(canvas, htmlLayer, params);

    this.textEditor = new CanvasText(canvas, htmlLayer, params, SHAPE_LABEL_STYLE);
    this.rectangle = this.createHoverRectangle();
    this.rectanglePreview = new CanvasRectangle(canvas, htmlLayer, previewStyles, getPreviewRectangleParams(params));
  }

  private createHoverRectangle() {
    const rectangleParams = getRectangleParams(this.ctx, SHAPE_LABEL_STYLE, this.textEditor.textParams);

    return new CanvasRectangle(this.canvas, this.htmlLayer, styles, rectangleParams);
  }

  public draw() {
    this.rectangle.isHover = this.isHover;
    this.rectangle.isActive = this.isActive;
    this.textEditor.isActive = this.isActive;

    if (!this.isEditing) {
      this.textEditor.draw();

      if (this.isActive) {
        this.rectangle.draw();
      }
    }
  }

  public includes(x: number, y: number) {
    return this.rectangle.includes(x, y);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    this.rectangle.move(dx, dy);
    this.textEditor.move(dx, dy);
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textEditor.renderHtml(parent, store, this.id, this.isEditing);
  }

  public drawPreview() {
    this.rectanglePreview.draw();

    // @TODO draw text appropriately
    this.ctx.save();
    this.ctx.strokeStyle = SHAPE_LABEL_COLOR;
    this.ctx.font = '40px Times New Roman';
    this.ctx.textAlign = 'left';
    this.ctx.strokeText('T', this.x - 12, this.y + 14);
    this.ctx.restore();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.rectanglePreview.includes(coordinates.x, coordinates.y);
  }
};
