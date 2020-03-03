import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import Dispatcher from '@app/flow/store/Dispatcher';
import Action from '@app/flow/store/history/Action';
import History from '@app/flow/store/history/History';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


export default class Store {
  private dispatcher: Dispatcher;
  private history: History;

  // SETTINGS
  scale: number = 1;
  grid = {
    enabled: true,
    snap: true,
  };

  // STATE
  selectedIndicator: Indicator | null | undefined = null;
  selectedNode: Node | null | undefined = null;
  selectedConnector: Link | null | undefined = null;
  selectedConnectionPoint: AnchorPoint | null | undefined = null;
  newConnector: Link | null | undefined = null;

  connectorList: Link[] = [];
  indicators: Indicator[] = [];
  nodeList: Node[] = [];

  // STATE

  constructor(options: FlowrigamiOptions) {
    this.dispatcher = new Dispatcher(this);
    this.history = new History();

    if (options.viewMode) {
      this.grid.enabled = false;
    }
  }

  public dispatch = (action: string, payload: any = null) => {
    this.dispatcher.dispatch(action, payload);
  };

  public notify = (action: string) => {
    this.dispatcher.notify(action);
  };

  public subscribe = (action: string, func: (data: any) => void) => {
    this.dispatcher.subscribe(action, func);
  };

  public unsubscribe = (action: string, func: (data: any) => void) => {
    this.dispatcher.unsubscribe(action, func);
  };

  public undo = () => {
    this.history.undo();
  };

  public redo = () => {
    this.history.redo();
  };

  public archiveAction = (action: Action) => {
    this.history.archiveAction(action);
  };

  public hasUndo = () => {
    return this.history.hasUndo();
  };

  public hasRedo = () => {
    return this.history.hasRedo();
  };

}
