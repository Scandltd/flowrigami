import DiagramApi from '@app/flow/api/DiagramApi';
import IndicatorApi from '@app/flow/api/IndicatorApi';
import Diagram from '@app/flow/diagram/Diagram';
import UmlDiagram from '@app/flow/diagram/uml/UmlDiagram';
import Layout from '@app/flow/Layout';
import BottomToolbar from '@app/flow/layout/BottomToolbar';
import Library from '@app/flow/layout/Library';
import PropertiesPanel from '@app/flow/layout/PropertiesPanel';
import TopToolbar from '@app/flow/layout/TopToolbar';
import Workspace from '@app/flow/layout/Workspace';
import Store from '@app/flow/store/Store';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


export default class Main {
  private options: FlowrigamiOptions;
  private layout: Layout;
  private store: Store;
  private diagram: Diagram;

  public diagramApi: DiagramApi;
  public indicatorApi: IndicatorApi;

  private workspace: Workspace;
  private bottomToolbar: BottomToolbar;
  private library?: Library;
  private topToolbar?: TopToolbar;
  private propertiesPanel?: PropertiesPanel;

  constructor(root: HTMLElement, options: FlowrigamiOptions) {
    this.options = options;
    this.layout = new Layout(root, options);
    this.store = new Store();
    this.diagram = new UmlDiagram(this.store, this.layout.workspaceCanvas, this.layout.workspaceHtmlLayer);

    this.diagramApi = new DiagramApi(this.diagram);
    this.indicatorApi = new IndicatorApi(this.store);

    this.workspace = new Workspace(this.layout, this.store, this.diagram);
    this.bottomToolbar = new BottomToolbar(this.layout, this.store);
    if (this.layout.library) {
      this.library = new Library(this.layout.library, this.diagram);
    }
    if (this.layout.topToolbar) {
      this.topToolbar = new TopToolbar(this.layout.topToolbar, this.store, this.diagram);
    }
    if (this.layout.propertiesPanel) {
      this.propertiesPanel = new PropertiesPanel(this.layout.propertiesPanel, this.store);
    }
  }

  public unmount() {
    this.workspace.unmount();
    this.bottomToolbar.unmount();

    if (this.library) {
      this.library.unmount();
    }
    if (this.topToolbar) {
      this.topToolbar.unmount();
    }
    if (this.propertiesPanel) {
      this.propertiesPanel.unmount();
    }
  };
}
