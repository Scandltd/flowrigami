import BpmnNodeFactory, { BpmnNodes } from '@app/flow/diagram/bpmn/BpmnNodeFactory';
import Diagram from '@app/flow/diagram/Diagram';
import Store from '@app/flow/store/Store';


export default class BpmnDiagram extends Diagram {
  public name = 'BPMN';
  public nodes = [
    BpmnNodes.BoundaryInterrupting,
    BpmnNodes.BoundaryNonInterrupting,
    BpmnNodes.EventSubProcessInterrupting,
    BpmnNodes.EventSubProcessNonInterrupting,
    BpmnNodes.Standard,
    BpmnNodes.Catching,
    BpmnNodes.Throwing,
    BpmnNodes.End,
  ];

  private _nodeFactory: BpmnNodeFactory;

  constructor(store: Store, canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    super(store);

    this._nodeFactory = this.createNodeFactory(canvas, htmlLayer);
  }

  public get nodeFactory() {
    return this._nodeFactory;
  }

  public createNodeFactory(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    return new BpmnNodeFactory(canvas, htmlLayer);
  }
}
