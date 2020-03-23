import Context from '@app/flow/Context';
import { GRID_STEP } from '@app/flow/DefaultThemeConstants';
import Diagram from '@app/flow/diagram/Diagram';
import { chartBorderDefinition } from '@app/flow/layout/workspace/Canvas';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import FileUtils from '@app/flow/utils/FileUtils';
import { checkboxChange, inputFileChange } from '@app/flow/utils/HtmlUtils';


export default class TopToolbar {
  private diagram: Diagram;
  private store: Store;

  private showGridCheckbox: HTMLInputElement;
  private snapToGridCheckbox: HTMLInputElement;

  private exportJsonButton: HTMLAnchorElement;
  private exportPngButton: HTMLAnchorElement;
  private importJsonButton: HTMLAnchorElement;

  private autoLayoutButton: HTMLLinkElement;
  private undoButton: HTMLLinkElement;
  private redoButton: HTMLLinkElement;

  constructor(context: Context, topToolbarElement: HTMLElement) {
    this.diagram = context.diagram;
    this.store = context.store;

    this.autoLayoutButton = topToolbarElement.querySelector('[name="fl_auto_layout"]') as HTMLLinkElement;
    this.undoButton = topToolbarElement.querySelector('[name="fl_undo_button"]') as HTMLLinkElement;
    this.redoButton = topToolbarElement.querySelector('[name="fl_redo_button"]') as HTMLLinkElement;
    this.showGridCheckbox = this.initShowGridCheckbox(topToolbarElement);
    this.snapToGridCheckbox = this.initSnapToGridCheckbox(topToolbarElement);
    this.exportJsonButton = this.initExportJsonButton(topToolbarElement);
    this.exportPngButton = this.initExportPngButton(topToolbarElement);
    this.importJsonButton = this.initImportJsonButton(topToolbarElement);

    this.autoLayoutButton.onclick = () => this.store.dispatch(ACTION.AUTO_LAYOUT);
    this.undoButton.onclick = () => this.store.dispatch(ACTION.UNDO);
    this.redoButton.onclick = () => this.store.dispatch(ACTION.REDO);

    // @TODO hide undo-redo
    const undoRedo = topToolbarElement.querySelector('.fl-controller-item') as HTMLElement;
    undoRedo.style.display = 'none';

    this.store.subscribe(ACTION.SET_NODE, this.updateHistoryButtons);
    this.store.subscribe(ACTION.SET_CONNECTOR, this.updateHistoryButtons);
    this.store.subscribe(ACTION.SET_NEW_CONNECTOR, this.updateHistoryButtons);
    this.store.subscribe(ACTION.SET_CONNECTION_POINT, this.updateHistoryButtons);
    this.store.subscribe(ACTION.ADD_NODE, this.updateHistoryButtons);
    this.store.subscribe(ACTION.ADD_CONNECTOR, this.updateHistoryButtons);
    this.store.subscribe(ACTION.DELETE_NODE, this.updateHistoryButtons);
    this.store.subscribe(ACTION.DELETE_CONNECTOR, this.updateHistoryButtons);
    this.store.subscribe(ACTION.UNDO, this.updateHistoryButtons);
    this.store.subscribe(ACTION.REDO, this.updateHistoryButtons);
  }

  private updateHistoryButtons = () => {
    if (!this.store.hasUndo() && !this.undoButton.classList.contains('fl-btn-disabled')) {
      this.undoButton.classList.add('fl-btn-disabled');
    } else if (this.store.hasUndo() && this.undoButton.classList.contains('fl-btn-disabled')) {
      this.undoButton.classList.remove('fl-btn-disabled');
    }

    if (!this.store.hasRedo() && !this.redoButton.classList.contains('fl-btn-disabled')) {
      this.redoButton.classList.add('fl-btn-disabled');
    } else if (this.store.hasRedo() && this.redoButton.classList.contains('fl-btn-disabled')) {
      this.redoButton.classList.remove('fl-btn-disabled');
    }
  };

  private initShowGridCheckbox = (parent: HTMLElement) => {
    const showGrid = parent.querySelector('[name="fl_show_grid"]') as HTMLInputElement;
    showGrid.checked = this.store.grid.enabled;
    showGrid.oninput = checkboxChange((checked) => {
      this.store.dispatch(ACTION.GRID_VIEW, checked);
    });

    return showGrid;
  };

  private initSnapToGridCheckbox = (parent: HTMLElement) => {
    const snapToGrid = parent.querySelector('[name="fl_snap_to_grid"]') as HTMLInputElement;
    snapToGrid.checked = this.store.grid.snap;
    snapToGrid.oninput = checkboxChange((checked) => {
      this.store.dispatch(ACTION.GRID_SNAP, checked);
    });
    return snapToGrid;
  };

  private initExportJsonButton = (parent: HTMLElement) => {
    const exportJsonButton = parent.querySelector('[name="fl_export_json"]') as HTMLAnchorElement;
    exportJsonButton.onclick = () => {
      const fileName = `${this.diagram.name}.json`;
      const exportObject = this.diagram.export();
      FileUtils.handleClickDownloadJson(exportJsonButton, fileName, exportObject);
    };
    return exportJsonButton;
  };

  private initExportPngButton = (parent: HTMLElement) => {
    const exportPngButton = parent.querySelector('[name="fl_export_png"]') as HTMLAnchorElement;
    exportPngButton.onclick = () => this.handleSaveScaledPng(exportPngButton);
    return exportPngButton;
  };

  private initImportJsonButton = (parent: HTMLElement) => {
    const inputFile = document.createElement('input') as HTMLInputElement;
    inputFile.type = 'file';
    inputFile.onclick = (e) => { (e.target as HTMLInputElement).value = ''; };
    inputFile.onchange = inputFileChange((files) => {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.diagram.import(JSON.parse(e.target.result.toString()));
        }
      };
      reader.onerror = (evt) => {
        // ignore
      };
    });

    const importJsonButton = parent.querySelector('[name="fl_import_json"]') as HTMLAnchorElement;
    importJsonButton.onclick = () => {
      inputFile.click();
    };
    return importJsonButton;
  };

  // TODO line width isn't printed correctly
  private handleSaveScaledPng = (exportPngButton: HTMLAnchorElement) => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const htmlLayer = document.createElement('div');

    const detectionBorder = GRID_STEP*5;
    const { min, max } = chartBorderDefinition(this.store.nodes, this.store.links);
    const diagramWidth = max.x - min.x + 2*detectionBorder;
    const diagramHeight = max.y - min.y + 2*detectionBorder;
    const quality = this.getQuality(diagramWidth, diagramHeight);

    canvas.width = diagramWidth*quality;
    canvas.height = diagramHeight*quality;

    const offsetX = (detectionBorder - min.x)*quality;
    const offsetY = (detectionBorder - min.y)*quality;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.translate(offsetX, offsetY);
    ctx.scale(quality, quality);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const nodeFactory = this.diagram.createNodeFactory(canvas, htmlLayer);
    this.store.nodes.forEach((it) => {
      const node = nodeFactory.getNode(it.name, { x: it.x, y: it.y });
      node.draw();
    });
    this.store.links.forEach((it) => {
      nodeFactory.getLink(it.points).draw();
    });

    const fileName = 'UML.png';
    const imageUrl = canvas.toDataURL('image/png');
    FileUtils.handleClickDownload(exportPngButton, fileName, imageUrl);
  };

  private getQuality = (width: number, height: number) => {
    // 2_400_000 max pixels for save in png
    const quality = Math.floor(2_400_000/(width*height));

    return Math.max(quality, 1);
  };

  public unmount() {
    this.store.unsubscribe(ACTION.SET_NODE, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.SET_CONNECTOR, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.SET_NEW_CONNECTOR, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.SET_CONNECTION_POINT, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.ADD_NODE, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.ADD_CONNECTOR, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.DELETE_NODE, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.DELETE_CONNECTOR, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.UNDO, this.updateHistoryButtons);
    this.store.unsubscribe(ACTION.REDO, this.updateHistoryButtons);
  };
}
