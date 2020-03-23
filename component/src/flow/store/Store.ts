import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator from '@app/flow/diagram/common/Indicator';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import Dispatcher from '@app/flow/store/Dispatcher';
import Action from '@app/flow/store/history/Action';
import History from '@app/flow/store/history/History';
import Observable from '@app/flow/store/Observable';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


export default class Store extends Observable {
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


  indicators: Indicator[] = [];
  links: Link[] = [];
  nodes: Node[] = [];
  // STATE

  constructor(options: FlowrigamiOptions) {
    super();

    this.dispatcher = new Dispatcher(this);
    this.history = new History();

    if (options.viewMode) {
      this.grid.enabled = false;
    }
  }

  public findIndicatorById(id: string) {
    return this.indicators.find((it) => it.id === id);
  }

  public findIndicatorByCoordinates(x: number, y: number) {
    return this.indicators.find((it) => it.includes(x, y));
  }

  public addIndicator(indicator: Indicator) {
    this.indicators.push(indicator);
  }

  public deleteIndicatorById(id: string) {
    this.indicators = this.indicators.filter((it) => it.id !== id);
  }

  public moveAllIndicators(dx: number, dy: number) {
    this.indicators.forEach((it) => it.move(dx, dy));
  }

  public replaceAllIndicators(indicators: Indicator[]) {
    this.indicators = indicators;
  }

  public deleteAllIndicators() {
    this.indicators = [];
  }

  public findLinkByCoordinates(x: number, y: number) {
    return this.links.find((it) => it.includes(x, y));
  }

  public addLink(link: Link) {
    this.links.push(link);
  }

  public addLinks(link: Link[]) {
    this.links.push(...link);
  }

  public deleteLinkById(id: string) {
    const link = this.links.find((it) => it.id === id);
    if (!link) {
      return;
    }

    const firstPoint = link.points[0] as AnchorPoint;
    firstPoint.links = firstPoint.links.filter((it) => it !== link);

    const lastPoint = link.points[link.points.length - 1] as AnchorPoint;
    lastPoint.links = lastPoint.links.filter((it) => it !== link);

    this.links = this.links.filter((it) => it.id !== id);
  }

  public findAllLinksByNode(node: Node) {
    const links: Link[] = [];

    const anchors = node.points;
    anchors.map((it) => {
      links.push(...it.links);
    });

    return links;
  }

  public moveAllLinks(dx: number, dy: number) {
    this.links.forEach((it) => it.move(dx, dy));
  }

  public replaceAllLinks(links: Link[]) {
    this.links = links;
  }

  public deleteAllLinksByNodeId(nodeId: string) {
    this.links = this.links.filter((it) => it.points.some((it) => (!it.owner || it.owner.id !== nodeId)));
  }

  public deleteAllLinks() {
    this.links = [];
  }

  public findNodeById(id: string) {
    return this.nodes.find((it) => it.id === id);
  }

  public findNodeByCoordinates(x: number, y: number) {
    return this.nodes.find((it) => it.includes(x, y));
  }

  public addNode(node: Node) {
    this.nodes.push(node);
  }

  public deleteNodeById(id: string) {
    this.nodes = this.nodes.filter((it) => it.id !== id);
  }

  public moveAllNodes(dx: number, dy: number) {
    this.nodes.forEach((it) => it.move(dx, dy));
  }

  public replaceAllNodes(nodes: Node[]) {
    this.nodes = nodes;
  }

  public deleteAllNodes() {
    this.nodes = [];
  }

  public dispatch = (action: string, payload: any = null) => {
    this.dispatcher.dispatch(action, payload);
    this.notify(action);
  };

  public undo = () => {
    this.history.undo();
  };

  public redo = () => {
    this.history.redo();
  };

  public archiveAction = (action: Action) => {
    this.history.execute(action);
  };

  public hasUndo = () => {
    return this.history.canUndo();
  };

  public hasRedo = () => {
    return this.history.canRedo();
  };

}
