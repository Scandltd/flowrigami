import CanvasAnchorPoint from '@app/_redesign/graphics/canvas/shapes/CanvasAnchorPoint';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';


export default abstract class Node extends CanvasShape {
  protected connections: CanvasAnchorPoint[] = [];

  public findConnectionPoint(x: number, y: number) {
    return this.connections.find((it) => it.includes(x, y));
  }
}
