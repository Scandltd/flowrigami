import DiagramApi from '@app/flow/api/DiagramApi';
import IndicatorApi from '@app/flow/api/IndicatorApi';
import Context from '@app/flow/Context';
import Layout from '@app/flow/Layout';
import BottomToolbar from '@app/flow/layout/BottomToolbar';
import Library from '@app/flow/layout/Library';
import PropertiesPanel from '@app/flow/layout/PropertiesPanel';
import TopToolbar from '@app/flow/layout/TopToolbar';
import Workspace from '@app/flow/layout/Workspace';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


export default class Main {
  private context: Context;

  public diagramApi: DiagramApi;
  public indicatorApi: IndicatorApi;

  private workspace: Workspace;
  private bottomToolbar: BottomToolbar;
  private library?: Library;
  private topToolbar?: TopToolbar;
  private propertiesPanel?: PropertiesPanel;

  constructor(root: HTMLElement, options: FlowrigamiOptions) {
    const layout = new Layout(root, options);
    this.context = new Context(layout, options);

    this.diagramApi = new DiagramApi(this.context);
    this.indicatorApi = new IndicatorApi(this.context);

    this.workspace = new Workspace(this.context);
    this.bottomToolbar = new BottomToolbar(this.context);
    if (this.context.layout.library) {
      this.library = new Library(this.context, this.context.layout.library);
    }
    if (this.context.layout.topToolbar) {
      this.topToolbar = new TopToolbar(this.context, this.context.layout.topToolbar);
    }
    if (this.context.layout.propertiesPanel) {
      this.propertiesPanel = new PropertiesPanel(this.context, this.context.layout.propertiesPanel);
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
