import Context from '@app/flow/Context';
import Store from '@app/flow/store/Store';


export default class CanvasGrabbingEventListener {
  private context: Context;
  private store: Store;
  private workspaceContainer: HTMLElement;

  private isGrabbing = false;

  constructor(context: Context) {
    this.context = context;
    this.store = context.store;
    this.workspaceContainer = context.layout.workspaceContainer;

    this.workspaceContainer.addEventListener('mousedown', this.onMouseDown);
    this.workspaceContainer.addEventListener('mousemove', this.onMouseMove);
    this.workspaceContainer.addEventListener('mouseup', this.onMouseUp);
    this.workspaceContainer.addEventListener('mouseleave', this.onMouseUp);
  }

  private onMouseDown = (e: MouseEvent) => {
    const isViewMode = this.context.options.viewMode;
    this.isGrabbing = isViewMode || !this.isMouseOnAnyShape(e);
    if (this.isGrabbing) {
      this.workspaceContainer.style.cursor = 'grabbing';
      e.stopImmediatePropagation();
    }
  };

  private isMouseOnAnyShape = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;

    return this.store.findIndicatorByCoordinates(x, y) || this.store.findNodeByCoordinates(x, y) || this.store.findLinkByCoordinates(x, y);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isGrabbing) {
      const top = parseInt(this.workspaceContainer.style.top, 10) || 0;
      const left = parseInt(this.workspaceContainer.style.left, 10) || 0;

      this.workspaceContainer.style.top = `${top + e.movementY}px`;
      this.workspaceContainer.style.left = `${left + e.movementX}px`;
      e.stopImmediatePropagation();
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (this.isGrabbing) {
      this.isGrabbing = false;
      this.workspaceContainer.style.cursor = 'default';
      e.stopImmediatePropagation();
    }
  };
}
