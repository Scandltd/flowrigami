import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import NodeShape from '@app/flow/diagram/NodeShape';
import Dispatcher from '@app/flow/store/Dispatcher';
import Action from '@app/flow/store/history/Action';
import History from '@app/flow/store/history/History';


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
  selectedNode: NodeShape | null | undefined = null;
  selectedConnector: Link | null | undefined = null;
  selectedConnectionPoint: AnchorPoint | null | undefined = null;
  newConnector: Link | null | undefined = null;

  connectorList: Link[] = [];
  indicators: Indicator[] = [];
  nodeList: NodeShape[] = [];
  // STATE

  constructor() {
    this.dispatcher = new Dispatcher(this);
    this.history = new History();
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
