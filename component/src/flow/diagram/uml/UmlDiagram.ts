import Diagram from '@app/flow/diagram/Diagram';
import UmlDiagramFactory, { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import Store from '@app/flow/store/Store';


export default class UmlDiagram extends Diagram {
  public name = 'UML';
  public nodes = [
    UmlNodes.StartNode,
    UmlNodes.EndNode,
    UmlNodes.ActivityNode,
    UmlNodes.DecisionNode,
    UmlNodes.VerticalForkJoinNode,
    UmlNodes.HorizontalForkJoinNode,
    UmlNodes.TextNode,
  ];

  private _nodeFactory: UmlDiagramFactory;

  constructor(store: Store, canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    super(store);

    this._nodeFactory = this.createNodeFactory(canvas, htmlLayer);
  }

  public get nodeFactory() {
    return this._nodeFactory;
  }

  public createNodeFactory(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    return new UmlDiagramFactory(canvas, htmlLayer);
  }
}
