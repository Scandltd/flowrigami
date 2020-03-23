import CanvasShape from '@app/flow/diagram/bpmn/BpmnCanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


interface ReversedCheckMarkParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class ReversedCheckMark extends CanvasShape {
  name = 'ReversedCheckMark';
  x: number;
  y: number;
  width: number;
  height: number;
  shapeStyle: ShapeStyle;


  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, shapeStyle: ShapeStyle, reversedCheckMarkParams: ReversedCheckMarkParams) {
    super(canvas, htmlLayer);
    this.x = reversedCheckMarkParams.x;
    this.y = reversedCheckMarkParams.y;
    this.width = reversedCheckMarkParams.width;
    this.height = reversedCheckMarkParams.height;
    this.shapeStyle = shapeStyle;
  }

  public draw() {
    drawPath2D(this.ctx, this.createPath2D(), this.getShapeStyles());
  }

  private getShapeStyles() {
    const shapeStyle = this.shapeStyle;
    return this.isActive ? (shapeStyle.active || shapeStyle) : (this.isHover ? (shapeStyle.hover || shapeStyle) : shapeStyle);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  public includes(x: number, y: number) {
    return this.ctx.isPointInPath(this.createPath2D(), x, y);
  }

  private createPath2D() {
    const path = new Path2D();
    path.moveTo(this.x, this.y - this.height);
    path.lineTo(this.x + this.width*Math.sqrt(3)/2, this.y + this.height/2);
    path.lineTo(this.x, this.y);
    path.lineTo(this.x - this.width*Math.sqrt(3)/2, this.y + this.height/2);
    path.closePath();

    return path;
  }
}
