import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import NodeShape from '@app/flow/diagram/NodeShape';
import ACTION from '@app/flow/store/ActionTypes';
import AddConnection from '@app/flow/store/history/impl/AddConnection';
import AddIndicator from '@app/flow/store/history/impl/AddIndicator';
import AddNode from '@app/flow/store/history/impl/AddNode';
import DeleteConnection from '@app/flow/store/history/impl/DeleteConnection';
import DeleteIndicator from '@app/flow/store/history/impl/DeleteIndicator';
import DeleteNode from '@app/flow/store/history/impl/DeleteNode';
import Observable from '@app/flow/store/Observable';
import Store from '@app/flow/store/Store';


export default class Dispatcher extends Observable {
  private store: Store;

  constructor(store: Store) {
    super();
    this.store = store;
  }

  public dispatch = (action: string, payload: any = null) => {
    this.update(action, payload);
    this.notify(action);
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
        const indicator = this.store.indicators.find(node => node.id === payload.id);
        if (indicator) {
          indicator.setEditing(payload.isEditing);
        }
        break;
      }
      case ACTION.SET_NODE_EDIT: {
        const node = this.store.nodeList.find(node => node.id === payload.id);
        if (node) {
          node.setEditing(payload.isEditing);
        }
        break;
      }
      case ACTION.UPDATE_SHAPE_TEXT: {
        const node = this.store.indicators.find(node => node.id === payload.id) ||
          this.store.nodeList.find(node => node.id === payload.id);
        if (node) {
          node.setLabel(payload.text);
        }
        break;
      }
      case ACTION.SET_CONNECTOR:
        this.store.selectedConnector = payload;
        break;
      case ACTION.SET_NEW_CONNECTOR:
        if (payload) {
          this.store.selectedConnectionPoint = payload.points[1];
        }
        this.store.newConnector = payload;
        break;
      case ACTION.SET_CONNECTION_POINT:
        this.store.selectedConnectionPoint = payload;
        break;
      case ACTION.ADD_CONNECTOR:
        this.store.archiveAction(new AddConnection(this.store, payload));
        this.store.connectorList.push(payload);
        break;
      case ACTION.ADD_NODE:
        this.store.nodeList.push(payload);
        this.store.archiveAction(new AddNode(this.store, payload));
        break;
      case ACTION.ADD_INDICATOR: {
        this.store.indicators.push(payload);
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
        this.deleteConnector(payload);
        break;
      case ACTION.CLEAR_DIAGRAM: {
        this.store.connectorList = [];
        this.store.indicators = [];
        this.store.nodeList = [];
        break;
      }
      case ACTION.IMPORT: {
        this.store.indicators = payload.indicators;
        this.store.connectorList = payload.links;
        this.store.nodeList = payload.nodes;
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
        this.store.nodeList.forEach((node) => node.isActive = false);
        this.store.connectorList.forEach((link) => link.isActive = false);
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
    this.store.indicators = this.store.indicators.filter(node => node.id !== indicator.id);
    this.store.selectedNode = null;
  };

  private deleteNode = (selectedNode: NodeShape) => {
    const deletedConnections: Link[] = [];
    // delete lines with points of the shape
    this.store.connectorList = this.store.connectorList.filter(line => {
      const detectedPoint = line.points.find(linePoint => {
        return selectedNode.points.find(point => point.id === linePoint.id);
      });
      if (detectedPoint) {
        deletedConnections.push(line);
      }

      return !detectedPoint;
    });

    this.store.archiveAction(new DeleteNode(this.store, selectedNode, deletedConnections));
    this.store.nodeList = this.store.nodeList.filter((node) => node.id !== selectedNode.id);
    this.store.selectedNode = null;
  };

  private deleteConnector = (selectedConnector: Link) => {
    this.store.archiveAction(new DeleteConnection(this.store, selectedConnector));
    this.store.connectorList = this.store.connectorList.filter(line => line.id !== selectedConnector.id);

    this.store.selectedConnector = null;
  };
}
