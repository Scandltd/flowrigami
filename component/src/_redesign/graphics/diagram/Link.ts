import CanvasAnchorPoint from '@app/_redesign/graphics/canvas/shapes/CanvasAnchorPoint';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';


export default abstract class Link extends CanvasShape {
  protected inflections: CanvasAnchorPoint[] = [];

  public findInflectionPoint(x: number, y: number) {
    return this.inflections.find((it) => it.includes(x, y));
  }

  public move(dx: number, dy: number) {
    // links are not moveable
  }
}
