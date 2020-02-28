import Diagram from '@app/flow/diagram/Diagram';
import Layout from '@app/flow/Layout';
import Canvas from '@app/flow/layout/workspace/Canvas';
import CanvasEventListener from '@app/flow/layout/workspace/CanvasEventListener';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';


export default class Workspace {
  private layout: Layout;
  private store: Store;
  private diagram: Diagram;

  private canvas: Canvas;
  private canvasEventListener: CanvasEventListener;

  constructor(layout: Layout, store: Store, diagram: Diagram) {
    this.layout = layout;
    this.store = store;
    this.diagram = diagram;

    this.canvas = new Canvas(this.layout, this.store);

    const ctx = this.layout.workspaceCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasEventListener = new CanvasEventListener(this.layout.workspaceContainer, ctx, this.store, this.diagram);

    this.layout.workspace.addEventListener('wheel', this.onMouseWheel, { passive: false });
  }

  private onMouseWheel = (e: WheelEvent) => {
    if (e.ctrlKey && e.deltaY > 0) {
      this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale - 0.1);
      e.preventDefault();
    } else if (e.ctrlKey && e.deltaY < 0) {
      this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale + 0.1);
      e.preventDefault();
    }
  };

  public unmount() {
    this.canvas.unmount();
    this.canvasEventListener.unmount();

    this.layout.workspace.removeEventListener('wheel', this.onMouseWheel);
  }
}
