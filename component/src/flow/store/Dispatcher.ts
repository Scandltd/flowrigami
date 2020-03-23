import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator from '@app/flow/diagram/common/Indicator';
import DirectionalLink from '@app/flow/diagram/common/link/DirectionalLink';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import ACTION from '@app/flow/store/ActionTypes';
import AddIndicator from '@app/flow/store/history/actions/AddIndicator';
import AddLink from '@app/flow/store/history/actions/AddLink';
import AddNode from '@app/flow/store/history/actions/AddNode';
import DeleteIndicator from '@app/flow/store/history/actions/DeleteIndicator';
import DeleteLink from '@app/flow/store/history/actions/DeleteLink';
import DeleteNode from '@app/flow/store/history/actions/DeleteNode';
import Store from '@app/flow/store/Store';


export default class Dispatcher {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public dispatch = (action: string, payload: any = null) => {
    this.update(action, payload);
  };

  private update = (action: string, payload: any) => {
    switch (action) {
      case ACTION.SET_INDICATOR:
        this.store.selectedIndicator = payload;
        break;
      case ACTION.SET_NODE:
      case ACTION.UPDATE_NODE_PROPERTIES:
        this.store.selectedNode = payload;
        break;
      case ACTION.SET_INDICATOR_EDIT: {
        const indicator = this.store.findIndicatorById(payload.id);
        if (indicator) {
          indicator.isEditing = payload.isEditing;
        }
        break;
      }
      case ACTION.SET_NODE_EDIT: {
        const node = this.store.findNodeById(payload.id);
        if (node) {
          node.isEditing = payload.isEditing;
        }
        break;
      }
      case ACTION.UPDATE_SHAPE_TEXT: {
        const indicator = this.store.findIndicatorById(payload.id);
        if (indicator) {
          indicator.label = payload.text;
        } else {
          const node = this.store.findNodeById(payload.id);
          if (node) {
            node.label = payload.text;
          }
        }
        break;
      }
      case ACTION.SET_CONNECTOR:
        this.store.selectedConnector = payload;
        break;
      case ACTION.SET_NEW_CONNECTOR:
        this.store.newConnector = payload;
        break;
      case ACTION.SET_CONNECTION_POINT:
        this.store.selectedConnectionPoint = payload;
        break;
      case ACTION.ADD_CONNECTOR:
        this.createLink(payload);
        break;
      case ACTION.ADD_NODE:
        this.store.addNode(payload);
        this.store.archiveAction(new AddNode(this.store, payload));
        break;
      case ACTION.ADD_INDICATOR: {
        this.store.addIndicator(payload);
        this.store.archiveAction(new AddIndicator(this.store, payload));
        break;
      }
      case ACTION.DELETE_INDICATOR:
        this.deleteIndicator(payload);
        break;
      case ACTION.DELETE_NODE:
        this.deleteNode(payload);
        break;
      case ACTION.DELETE_CONNECTOR:
        this.store.archiveAction(new DeleteLink(this.store, payload));
        this.deleteLink(payload);
        break;
      case ACTION.CLEAR_DIAGRAM: {
        this.store.deleteAllIndicators();
        this.store.deleteAllLinks();
        this.store.deleteAllNodes();
        break;
      }
      case ACTION.IMPORT: {
        this.store.replaceAllIndicators(payload.indicators);
        this.store.replaceAllLinks(payload.links);
        this.store.replaceAllNodes(payload.nodes);
        break;
      }
      case ACTION.UNDO:
        this.store.undo();
        break;
      case ACTION.REDO:
        this.store.redo();
        break;
      case ACTION.ESCAPE:
        this.store.selectedIndicator = null;
        this.store.selectedNode = null;
        this.store.newConnector = null;
        this.store.selectedConnector = null;
        this.store.nodes.forEach((node) => node.isActive = false);
        this.store.links.forEach((link) => link.isActive = false);
        break;
      case ACTION.GRID_VIEW: {
        this.store.grid.enabled = payload;
        break;
      }
      case ACTION.GRID_SNAP: {
        this.store.grid.snap = payload;
        break;
      }
      case ACTION.CHANGE_SCALE: {
        let scale = payload;
        if (scale < 0.1) {
          scale = 0.1;
        } else if (scale > 10) {
          scale = 10;
        }

        this.store.scale = +scale.toFixed(1);
        break;
      }
      default:
        break;
    }
  };

  private deleteIndicator = (indicator: Indicator) => {
    this.store.archiveAction(new DeleteIndicator(this.store, indicator));
    this.store.deleteIndicatorById(indicator.id);
    this.store.selectedNode = null;
  };

  private deleteNode = (node: Node) => {
    const deletedConnections: Link[] = [];

    node.points.forEach((it) => {
      it.links.forEach((link) => {
        deletedConnections.push(link);
        this.deleteLink(link);
      });
    });

    this.store.selectedNode = null;
    this.store.deleteNodeById(node.id);
    this.store.archiveAction(new DeleteNode(this.store, node, deletedConnections));
  };

  private createLink = (link: DirectionalLink) => {
    const firstPoint = link.points[0] as AnchorPoint;
    const lastPoint = link.points[link.points.length - 1] as AnchorPoint;
    firstPoint.links.push(link);
    lastPoint.links.push(link);

    this.store.addLink(link);
    this.store.archiveAction(new AddLink(this.store, link));
  };

  private deleteLink = (link: Link) => {
    this.store.selectedConnector = null;
    this.store.deleteLinkById(link.id);
  };
}
