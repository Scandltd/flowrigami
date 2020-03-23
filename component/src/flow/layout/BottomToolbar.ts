import Context from '@app/flow/Context';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';


export default class BottomToolbar {
  private store: Store;
  private workspaceCanvas: HTMLCanvasElement; // @TODO no manual work here

  private centerWorkspaceButton: HTMLButtonElement;
  private increaseScaleButton: HTMLButtonElement;
  private decreaseScaleButton: HTMLButtonElement;
  private scaleText: HTMLElement;

  constructor(context: Context) {
    this.store = context.store;
    this.workspaceCanvas = context.layout.workspaceCanvas;

    const bottomToolbar = context.layout.bottomToolbar;
    this.centerWorkspaceButton = bottomToolbar.querySelector('[name="fl_btn_center_workspace"]') as HTMLButtonElement;
    this.centerWorkspaceButton.onclick = this.handleCenterWorkspace;

    this.increaseScaleButton = bottomToolbar.querySelector('[name="fl_btn_increase_scale"]') as HTMLButtonElement;
    this.increaseScaleButton.onclick = () => this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale + 0.1);

    this.decreaseScaleButton = bottomToolbar.querySelector('[name="fl_btn_decrease_scale"]') as HTMLButtonElement;
    this.decreaseScaleButton.onclick = () => this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale - 0.1);

    this.scaleText = bottomToolbar.querySelector('.fl-scale-value') as HTMLElement;

    this.store.subscribe(ACTION.CHANGE_SCALE, this.handleChangeScale);
  }

  private handleCenterWorkspace = () => {
    const workspaceCanvas = this.workspaceCanvas;
    const parentWidth = workspaceCanvas.parentElement!.offsetWidth;
    const parentHeight = workspaceCanvas.parentElement!.offsetHeight;
    workspaceCanvas.style.left = `${parentWidth > workspaceCanvas.width ? (parentWidth - workspaceCanvas.width)/2 : 0}px`;
    workspaceCanvas.style.top = `${parentHeight > workspaceCanvas.height ? (parentHeight - workspaceCanvas.height)/2 : 0}px`;

    this.store.dispatch(ACTION.CHANGE_SCALE, 1);
  };

  private handleChangeScale = () => {
    this.scaleText.innerText = `${(this.store.scale*100).toFixed()}%`;
  };

  public unmount() {
    this.store.unsubscribe(ACTION.CHANGE_SCALE, this.handleChangeScale);
  }
}
