import Diagram from '@app/flow/diagram/Diagram';
import UmlDiagram from '@app/flow/diagram/uml/UmlDiagram';
import Layout from '@app/flow/Layout';
import Store from '@app/flow/store/Store';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


export default class Context {
  public layout: Layout;
  public options: FlowrigamiOptions;

  public diagram: Diagram;
  public store: Store;

  constructor(layout: Layout, options: FlowrigamiOptions) {
    this.layout = layout;
    this.options = options;

    this.store = new Store(options);
    this.diagram = new UmlDiagram(this.store, this.layout.workspaceCanvas, this.layout.workspaceHtmlLayer);
  }
}
