import CanvasEventListener from '@app/_redesign/graphics/canvas/CanvasEventListener';
import DirectionalLink from '@app/_redesign/graphics/diagram/common/DirectionalLink';
import ActivityNode from '@app/_redesign/graphics/diagram/uml/ActivityNode';
import Storage from '@app/_redesign/storage/Storage';
import { stats } from '@app/flow/development/stats';
import CanvasGrid from '@app/flow/graphics/canvas/CanvasGrid';


export default class Canvas {
  private canvas: HTMLCanvasElement;
  private canvasContainer: HTMLElement;
  private canvasEventListener: CanvasEventListener;
  private ctx: CanvasRenderingContext2D;
  private htmlLayer: HTMLElement;
  private requestAnimationFrameId: number;

  private storage: Storage;
  private grid: CanvasGrid;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, canvasContainer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.canvasContainer = canvasContainer;

    this.storage = new Storage();
    this.canvasEventListener = new CanvasEventListener(this.canvasContainer, this.storage);
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.grid = new CanvasGrid(this.ctx);

    if (process.env.NODE_ENV === 'development') {
      const link1 = new DirectionalLink(canvas, htmlLayer, { from: { x: 420, y: 320 }, to: { x: 480, y: 320 } });
      const activityNode1 = new ActivityNode(canvas, htmlLayer, { x: 360, y: 320, width: 120, height: 60 });
      const activityNode2 = new ActivityNode(canvas, htmlLayer, { x: 540, y: 320, width: 120, height: 60 });
 
      this.storage.links.push(link1);
      this.storage.nodes.push(activityNode1, activityNode2);

      // @ts-ignore
      window.ctx_new = this.ctx;
    }

    const animate = () => {
      this.draw();
      this.requestAnimationFrameId = window.requestAnimationFrame(animate);
    };
    this.requestAnimationFrameId = window.requestAnimationFrame(animate);
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  @stats()
  public draw() {
    this.clear();

    if (this.storage.grid.enabled) {
      this.grid.draw(this.canvas.width, this.canvas.height);
    }

    this.storage.shapes.forEach((it) => {
      it.draw();
    });
  }

  public unmount() {
    window.cancelAnimationFrame(this.requestAnimationFrameId);

    this.canvasEventListener.unmount();
  }
}
