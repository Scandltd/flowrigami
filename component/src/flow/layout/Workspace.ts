import Context from '@app/flow/Context';
import Canvas from '@app/flow/layout/workspace/Canvas';
import CanvasEventListener from '@app/flow/layout/workspace/CanvasEventListener';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';


export default class Workspace {
  private store: Store;
  private workspace: HTMLElement;
  private canvas: Canvas;
  private canvasEventListener: CanvasEventListener;

  constructor(context: Context) {
    this.store = context.store;
    this.workspace = context.layout.workspace;
    this.canvas = new Canvas(context);
    this.canvasEventListener = new CanvasEventListener(context);

    this.workspace.addEventListener('wheel', this.onMouseWheel, { passive: false });
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

    this.workspace.removeEventListener('wheel', this.onMouseWheel);
  }
}
