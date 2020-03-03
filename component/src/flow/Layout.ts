import { GRID_MAIN_LINE_STEP, GRID_STEP } from '@app/flow/DefaultThemeConstants';
import layoutHtml from '@app/flow/layout/layout.html';
import bottomToolbarHtml from '@app/flow/layout/templates/bottom-toolbar.html';
import libraryHtml from '@app/flow/layout/templates/library.html';
import propertiesPanelHtml from '@app/flow/layout/templates/properties-panel.html';
import topToolbarHtml from '@app/flow/layout/templates/top-toolbar.html';
import workspaceHtml from '@app/flow/layout/templates/workspace.html';
import flowrigami from '@app/flowrigami.css';
import FlowrigamiOptions from '@app/FlowrigamiOptions';
import normalize from '@app/normalize.min.css';


export default class Layout {
  private shadowRoot: ShadowRoot;
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
    this.shadowRoot = root.shadowRoot || root.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
<style>
  ${normalize}
  ${flowrigami}
</style>
`;

    this.container = createLayout(this.shadowRoot, options);
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

function createLayout(root: ShadowRoot, options: FlowrigamiOptions) {
  const isViewMode = options.viewMode;

  const innerHtml = layoutHtml.
    replace('{workspace}', workspaceHtml).
    replace('{bottomToolbar}', bottomToolbarHtml).
    replace('{topToolbar}', isViewMode ? '' : topToolbarHtml).
    replace('{library}', isViewMode ? '' : libraryHtml).
    replace('{propertiesPanel}', isViewMode ? '' : propertiesPanelHtml);

  const div = document.createElement('div');
  div.innerHTML = innerHtml;

  root.append(div.firstChild!);

  const width = root.host.clientWidth;
  const height = root.host.clientHeight;
  const container = root.querySelector('.fl') as HTMLInputElement;
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
