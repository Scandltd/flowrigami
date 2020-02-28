import { GRID_MAIN_LINE_STEP, GRID_STEP } from '@app/flow/DefaultThemeConstants';
import FlowrigamiOptions from '@app/FlowrigamiOptions';
import html from '@app/flow/layout/layout.html';
import bottomToolbar from '@app/flow/layout/templates/bottom-toolbar.html';
import library from '@app/flow/layout/templates/library.html';
import propertiesPanel from '@app/flow/layout/templates/properties-panel.html';
import topToolbar from '@app/flow/layout/templates/top-toolbar.html';
import workspace from '@app/flow/layout/templates/workspace.html';


export default class Layout {
  private root: HTMLElement;
  public container: HTMLElement;

  public workspace: HTMLElement;
  public workspaceContainer: HTMLElement;
  public workspaceCanvas: HTMLCanvasElement;
  public workspaceHtmlLayer: HTMLElement;
  public bottomToolbar: HTMLElement;

  public topToolbar?: HTMLElement;
  public library?: HTMLElement;
  public propertiesPanel?: HTMLElement;

  constructor(root: HTMLElement, options: FlowrigamiOptions) {
    this.root = root;
    this.container = createLayout(root, options);
    this.workspace = this.container.querySelector('.fl-workspace') as HTMLElement;
    this.workspaceContainer = initCanvasContainer(this.workspace);
    this.workspaceCanvas = initCanvas(this.workspace);
    this.workspaceHtmlLayer = initHtmlLayer(this.workspaceContainer);
    this.bottomToolbar = this.container.querySelector('.fl-bottom-toolbar') as HTMLElement;

    if (!options.viewMode) {
      this.library = this.container.querySelector('.fl-library') as HTMLElement;
      this.topToolbar = this.container.querySelector('.fl-top-toolbar') as HTMLElement;
      this.propertiesPanel = this.container.querySelector('.fl-properties-panel') as HTMLElement;
    }
  }
}

function createLayout(parent: HTMLElement, options: FlowrigamiOptions) {
  const isViewMode = options.viewMode;

  parent.innerHTML = html;
  parent.innerHTML = parent.innerHTML.replace('{workspace}', workspace);
  parent.innerHTML = parent.innerHTML.replace('{bottomToolbar}', bottomToolbar);
  parent.innerHTML = parent.innerHTML.replace('{topToolbar}', isViewMode ? '' : topToolbar);
  parent.innerHTML = parent.innerHTML.replace('{library}', isViewMode ? '' : library);
  parent.innerHTML = parent.innerHTML.replace('{propertiesPanel}', isViewMode ? '' : propertiesPanel);

  const width = parent.clientWidth;
  const height = parent.clientHeight;
  const container = parent.querySelector('.fl') as HTMLInputElement;
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;

  return container;
}

/*
 * TODO: different approach could be synchronizing canvas and overlay div dimensions manually without common parent.
 *
 * Canvas scale and absolute position on the workspace are determined by wrapping container.
 * Canvas element itself resizes container (and inheriting overlay div) by adjusting width/height attributes
 * so overlay div is always in sync with canvas.
 *   <div class="fl-canvas-container">
 *     <canvas>
 *     <div></div>
 *   </div>
*/
function initCanvasContainer(workspace: HTMLElement) {
  const width = workspace.clientWidth;
  const height = workspace.clientHeight;

  const gridBlockPx = GRID_STEP*GRID_MAIN_LINE_STEP;
  const canvasWidth = Math.trunc(width/gridBlockPx)*gridBlockPx;
  const canvasHeight = Math.trunc(height/gridBlockPx)*gridBlockPx;

  const container = workspace.querySelector('.fl-canvas-container') as HTMLDivElement;
  container.style.left = `${(workspace.clientWidth - canvasWidth)/2}px`;
  container.style.top = `${(workspace.clientHeight - canvasHeight)/2}px`;

  return container;
}

function initCanvas(workspace: HTMLElement) {
  const width = workspace.clientWidth;
  const height = workspace.clientHeight;

  const gridBlockPx = GRID_STEP*GRID_MAIN_LINE_STEP;
  const canvasWidth = Math.trunc(width/gridBlockPx)*gridBlockPx;
  const canvasHeight = Math.trunc(height/gridBlockPx)*gridBlockPx;

  const canvas = workspace.querySelector('canvas') as HTMLCanvasElement;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  return canvas;
}

function initHtmlLayer(workspaceContainer: HTMLElement) {
  return workspaceContainer.querySelector('div') as HTMLElement;
}
