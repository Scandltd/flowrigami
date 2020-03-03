import Context from '@app/flow/Context';
import { GRID_MAIN_LINE_STEP, GRID_STEP } from '@app/flow/DefaultThemeConstants';
import { stats } from '@app/flow/development/stats';
import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import CanvasGrid from '@app/flow/graphics/canvas/CanvasGrid';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';


export function chartBorderDefinition(nodes: any[], links: any[], offset = 10) {
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

  const updateMinMax = (point: AnchorPoint) => {
    if (point.x + offset > maxX) {maxX = point.x + offset;}
    if (point.x - offset < minX) {minX = point.x - offset;}
    if (point.y + offset > maxY) {maxY = point.y + offset;}
    if (point.y - offset < minY) {minY = point.y - offset;}
  };

  nodes.forEach((node) => node.points.forEach(updateMinMax));
  links.forEach((link) => link.points.forEach(updateMinMax));

  return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } };
}

export default class Canvas {
  private store: Store;
  private workspace: HTMLElement;
  private workspaceContainer: HTMLElement;
  private workspaceCanvas: HTMLCanvasElement;
  private workspaceHtmlLayer: HTMLElement;

  private ctx: CanvasRenderingContext2D;

  private grid: CanvasGrid;
  private requestAnimationFrameId: number;

  constructor(context: Context) {
    this.store = context.store;
    this.workspace = context.layout.workspace;
    this.workspaceContainer = context.layout.workspaceContainer;
    this.workspaceCanvas = context.layout.workspaceCanvas;
    this.workspaceHtmlLayer = context.layout.workspaceHtmlLayer;

    this.ctx = this.workspaceCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.grid = new CanvasGrid(this.ctx);

    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.ctx = this.ctx;
    }

    const animate = () => {
      this.draw();
      this.requestAnimationFrameId = window.requestAnimationFrame(animate);
    };
    this.requestAnimationFrameId = window.requestAnimationFrame(animate);

    this.renderHtml();

    if (!context.options.viewMode) {
      document.addEventListener('keyup', this.onKeyUp);
      document.addEventListener('keydown', this.onKeyDown);
    }

    this.store.subscribe(ACTION.IMPORT, this.autoSizeWorkspace);
    this.store.subscribe(ACTION.AUTO_LAYOUT, this.autoLayout);
    this.store.subscribe(ACTION.CHANGE_SCALE, this.handleChangeScale);
    this.store.subscribe(ACTION.SET_INDICATOR_EDIT, this.renderHtml);
    this.store.subscribe(ACTION.SET_NODE_EDIT, this.renderHtml);
  }

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLElement) {
      const tagName = e.target.tagName.toLowerCase();
      if (this.workspaceHtmlLayer.contains(e.target) || tagName === 'input' || tagName === 'textarea') {
        return;
      }
    }

    switch (e.code) {
      case 'Delete':
        return this.handleDelete();
      case 'Backspace':
        return this.handleDelete();
      case 'Escape':
        return this.store.dispatch(ACTION.ESCAPE);
      default:
        return;
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyZ' && e.ctrlKey && e.shiftKey) {
      this.store.dispatch(ACTION.REDO);
    } else if (e.code === 'KeyZ' && e.ctrlKey) {
      this.store.dispatch(ACTION.UNDO);
    } else if (e.key === '+' && e.ctrlKey) {
      this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale + 0.1);
      e.preventDefault();
    } else if (e.key === '-' && e.ctrlKey) {
      this.store.dispatch(ACTION.CHANGE_SCALE, this.store.scale - 0.1);
      e.preventDefault();
    }
  };

  private autoLayout = () => {
    this.autoSizeWorkspace();

    const parentWidth = this.workspace.offsetWidth;
    const parentHeight = this.workspace.offsetHeight;

    const canvasCenterX = this.workspaceContainer.offsetWidth/2;
    const canvasCenterY = this.workspaceContainer.offsetHeight/2;

    const { min, max } = chartBorderDefinition(this.store.nodeList, this.store.connectorList);
    const diagramCenterX = min.x + (max.x - min.x)/2;
    const diagramCenterY = min.y + (max.y - min.y)/2;

    const offsetX = canvasCenterX - diagramCenterX;
    const offsetY = canvasCenterY - diagramCenterY;

    this.store.nodeList.forEach((node) => node.move(offsetX, offsetY));
    this.store.connectorList.forEach((link) => link.move(offsetX, offsetY));

    this.workspaceContainer.style.top = `${(parentHeight - this.workspaceContainer.offsetHeight)/2}px`;
    this.workspaceContainer.style.left = `${(parentWidth - this.workspaceContainer.offsetWidth)/2}px`;
  };

  private autoSizeWorkspace = () => {
    const gridBlockPx = GRID_STEP*GRID_MAIN_LINE_STEP;
    const parentWidth = this.workspace.offsetWidth;
    const parentHeight = this.workspace.offsetHeight;
    const minCanvasWidth = Math.trunc(parentWidth/gridBlockPx)*gridBlockPx;
    const minCanvasHeight = Math.trunc(parentHeight/gridBlockPx)*gridBlockPx;

    const { min, max } = chartBorderDefinition(this.store.nodeList, this.store.connectorList);

    const canvasWidth = Math.trunc(max.x/gridBlockPx)*gridBlockPx;
    const canvasHeight = Math.trunc(max.y/gridBlockPx)*gridBlockPx;

    this.workspaceCanvas.width = Math.max(canvasWidth + 2*gridBlockPx, minCanvasWidth);
    this.workspaceCanvas.height = Math.max(canvasHeight + 2*gridBlockPx, minCanvasHeight);
  };


  private handleChangeScale = () => {
    this.workspaceContainer.style.transform = `scale(${this.store.scale})`;
  };

  private handleDelete = () => {
    if (this.store.selectedIndicator) {
      this.store.dispatch(ACTION.DELETE_INDICATOR, this.store.selectedIndicator);
    } else if (this.store.selectedNode) {
      this.store.dispatch(ACTION.DELETE_NODE, this.store.selectedNode);
    } else if (this.store.selectedConnector) {
      this.store.dispatch(ACTION.DELETE_CONNECTOR, this.store.selectedConnector);
    }
  };

  public clear() {
    this.ctx.clearRect(0, 0, this.workspaceCanvas.width, this.workspaceCanvas.height);
  };

  @stats()
  public draw() {
    this.clear();

    if (this.store.grid.enabled) {
      this.grid.draw(this.workspaceCanvas.width, this.workspaceCanvas.height);
    }

    // @TODO some magic here: think over drawing order
    this.store.nodeList.forEach((it) => {
      if (!it.isHover || !it.isActive) {
        it.draw();
      }
    });

    this.store.connectorList.forEach((it) => {
      if (!it.isHover || !it.isActive) {
        it.draw();
      }
    });

    this.store.nodeList.forEach((node) => {
      if (node.isHover || node.isActive) {
        node.draw();
      }
    });

    this.store.connectorList.forEach((it) => {
      if (it.isHover || it.isActive) {
        it.draw();
      }
    });

    this.store.indicators.forEach((it) => {
      if (!it.isHover || !it.isActive) {
        it.draw();
      }
    });

    this.store.indicators.forEach((it) => {
      if (it.isHover || it.isActive) {
        it.draw();
      }
    });

    if (this.store.newConnector) {
      this.store.newConnector.draw();
    }
  }

  public renderHtml = () => {
    const textLayer = this.workspaceHtmlLayer;
    while (textLayer.firstChild) {
      textLayer.removeChild(textLayer.firstChild);
    }

    this.store.indicators.forEach(it => it.renderHtml(textLayer, this.store));
    this.store.nodeList.forEach(node => node.renderHtml(textLayer, this.store));
  };

  public unmount() {
    window.cancelAnimationFrame(this.requestAnimationFrameId);

    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('keydown', this.onKeyDown);

    this.store.unsubscribe(ACTION.IMPORT, this.autoSizeWorkspace);
    this.store.unsubscribe(ACTION.AUTO_LAYOUT, this.autoLayout);
    this.store.unsubscribe(ACTION.CHANGE_SCALE, this.handleChangeScale);
    this.store.unsubscribe(ACTION.SET_INDICATOR_EDIT, this.renderHtml);
    this.store.unsubscribe(ACTION.SET_NODE_EDIT, this.renderHtml);
  }
}
