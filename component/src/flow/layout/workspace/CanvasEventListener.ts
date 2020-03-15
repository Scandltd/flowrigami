import Context from '@app/flow/Context';
import { GRID_STEP } from '@app/flow/DefaultThemeConstants';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator from '@app/flow/diagram/common/Indicator';
import Diagram from '@app/flow/diagram/Diagram';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import { chartBorderDefinition } from '@app/flow/layout/workspace/Canvas';
import ACTION from '@app/flow/store/ActionTypes';
import MoveInstance from '@app/flow/store/history/impl/MoveInstance';
import Store from '@app/flow/store/Store';


export default class CanvasEventListener {
  private context: Context;
  private store: Store;
  private diagram: Diagram;
  private workspaceContainer: HTMLElement;
  private ctx: CanvasRenderingContext2D;

  private grabbing = false;
  private isMovableShape = true;
  private moveAction: MoveInstance | null = null;
  private editedShape: Indicator | Node | null = null;

  private anchorPoint: AnchorPoint | null | undefined = null;
  private anchorPointLink: Link | null | undefined = null;


  constructor(context: Context) {
    this.context = context;
    this.diagram = context.diagram;
    this.store = context.store;
    this.workspaceContainer = context.layout.workspaceContainer;
    this.ctx = context.layout.workspaceCanvas.getContext('2d') as CanvasRenderingContext2D;

    this.addEventListeners();
  }

  public unmount() {
    this.removeEventListeners();
  }

  private addEventListeners = () => {
    this.workspaceContainer.addEventListener('mousedown', this.onMouseDown);
    this.workspaceContainer.addEventListener('mouseup', this.onMouseUp);
    this.workspaceContainer.addEventListener('mousemove', this.onMouseMove);
    this.workspaceContainer.addEventListener('mouseleave', this.onMouseUp);

    if (!this.context.options.viewMode) {
      this.workspaceContainer.addEventListener('click', this.onMouseClick);
      this.workspaceContainer.addEventListener('dblclick', this.onMouseDbClick);

      this.workspaceContainer.addEventListener('dragover', this.onDragover);
      this.workspaceContainer.addEventListener('drop', this.onDrop);
    }
  };

  private removeEventListeners = () => {
    this.workspaceContainer.removeEventListener('mousemove', this.onMouseMove);
    this.workspaceContainer.removeEventListener('mousedown', this.onMouseDown);
    this.workspaceContainer.removeEventListener('mouseup', this.onMouseUp);
    this.workspaceContainer.removeEventListener('mouseleave', this.onMouseUp);
    this.workspaceContainer.removeEventListener('click', this.onMouseClick);
    this.workspaceContainer.removeEventListener('dblclick', this.onMouseDbClick);

    this.workspaceContainer.removeEventListener('dragover', this.onDragover);
    this.workspaceContainer.removeEventListener('drop', this.onDrop);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.grabbing) {
      const top = this.workspaceContainer.style.top ? parseInt(this.workspaceContainer.style.top, 10) : 0;
      const left = this.workspaceContainer.style.left ? parseInt(this.workspaceContainer.style.left, 10) : 0;

      this.workspaceContainer.style.top = `${top + e.movementY}px`;
      this.workspaceContainer.style.left = `${left + e.movementX}px`;
      return;
    }

    if (this.context.options.viewMode) return;

    const dx = e.movementX/this.store.scale;
    const dy = e.movementY/this.store.scale;

    if (this.anchorPoint && this.anchorPointLink) {
      if (!this.moveAction) {
        this.moveAction = new MoveInstance(this.anchorPointLink);
      }
      this.moveAction.pushCoordinates(dx, dy);
      this.anchorPointLink.movePoint(this.anchorPoint, dx, dy);
    }

    this.onHoverDetection(e);
    if (!this.store.newConnector && !this.store.selectedConnectionPoint) {
      this.handleCursorMutation(e);
    }

    if (this.isMovableShape) {
      const selectedShape = this.store.selectedIndicator || this.store.selectedNode;
      if (selectedShape) {
        if (!this.moveAction) {
          this.moveAction = new MoveInstance(selectedShape);
          this.editedShape = null;
        }
        this.moveAction.pushCoordinates(dx, dy);
        selectedShape.move(dx, dy);
      }
    }

    if (this.store.selectedNode || this.store.selectedConnector) {
      this.resizeWorkspace();
    }
  };

  private onHoverDetection = (e: MouseEvent) => {
    const { x, y } = this.getCursorCoordinates(e);

    this.store.indicators.forEach((it) => {
      const isMouseIn = it.includes(x, y);
      if (!it.isActive) {it.isHover = isMouseIn;}
    });
    this.store.nodes.forEach((it) => {
      const isMouseIn = it.includes(x, y);
      if (!it.isActive) {it.isHover = isMouseIn;}
    });
    this.store.links.forEach(link => link.onHover(link.includes(x, y)));
  };

  private getCursorCoordinates = (e: MouseEvent): CoordinatePoint => ({ x: e.offsetX, y: e.offsetY });

  private handleCursorMutation = (e: MouseEvent) => {
    if (!this.grabbing) {
      const { x, y } = this.getCursorCoordinates(e);

      const hoveredIndicator = this.store.findIndicatorByCoordinates(x, y);
      const hoveredLink = this.store.findLinkByCoordinates(x, y);
      const hoveredNode = this.store.findNodeByCoordinates(x, y);
      if (hoveredIndicator || hoveredLink || hoveredNode) {
        this.workspaceContainer.style.cursor = 'pointer';
        if (hoveredNode && hoveredNode.getConnectionPoint({ x, y })) {
          this.workspaceContainer.style.cursor = 'crosshair';
        }
      } else {
        this.workspaceContainer.style.cursor = 'default';
      }
    }
  };

  private resizeWorkspace = () => {
    const { min, max } = chartBorderDefinition(this.store.nodes, this.store.links);

    // needs for fixing offset canvas when scale < 1
    const scaleOffset = (1 - this.store.scale)*100;
    const canvasAreaIncrement = GRID_STEP*20;
    const detectionBorder = GRID_STEP*5;

    let isWorkspaceResized = false;
    let offsetX = 0;
    let offsetY = 0;

    const realCanvas = this.ctx.canvas;
    if (min.x < detectionBorder) {
      const left = this.workspaceContainer.style.left ? parseInt(this.workspaceContainer.style.left, 10) : 0;

      this.workspaceContainer.style.left = `${left - canvasAreaIncrement + scaleOffset}px`;
      realCanvas.width += canvasAreaIncrement;
      offsetX = canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (min.y < detectionBorder) {
      const top = this.workspaceContainer.style.top ? parseInt(this.workspaceContainer.style.top, 10) : 0;

      this.workspaceContainer.style.top = `${top - canvasAreaIncrement + scaleOffset}px`;
      realCanvas.height += canvasAreaIncrement;
      offsetY = canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (max.x + detectionBorder > realCanvas.width) {
      const left = this.workspaceContainer.style.left ? parseInt(this.workspaceContainer.style.left, 10) : 0;

      this.workspaceContainer.style.left = `${left - scaleOffset}px`;
      realCanvas.width += canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (max.y + detectionBorder > realCanvas.height) {
      const top = this.workspaceContainer.style.top ? parseInt(this.workspaceContainer.style.top, 10) : 0;

      this.workspaceContainer.style.top = `${top - scaleOffset}px`;
      realCanvas.height += canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (isWorkspaceResized) {
      this.store.moveAllIndicators(offsetX, offsetY);
      this.store.moveAllLinks(offsetX, offsetY);
      this.store.moveAllNodes(offsetX, offsetY);
    }
  };

  private onMouseDown = (e: MouseEvent) => {
    if (this.context.options.viewMode) {
      this.workspaceContainer.style.cursor = 'grabbing';
      this.grabbing = true;
      return;
    }

    this.isMovableShape = true;
    const { x, y } = this.getCursorCoordinates(e);

    this.selectIndicator(this.store.findIndicatorByCoordinates(x, y));
    this.selectNode(this.store.findNodeByCoordinates(x, y));
    this.selectLink(this.store.findLinkByCoordinates(x, y));

    let pointConnection;
    if (this.store.selectedIndicator) {
      // ignore
    } else if (this.store.selectedNode) {
      pointConnection = this.store.selectedNode.getConnectionPoint({ x, y });
    } else if (this.store.selectedConnector) {
      const detectedPoint = this.store.selectedConnector.getDetectedPoint({ x, y });
      if (detectedPoint) {
        this.anchorPoint = detectedPoint;
        this.anchorPointLink = this.store.selectedConnector;
      }

      this.store.dispatch(ACTION.SET_CONNECTION_POINT, detectedPoint);
    } else {
      this.workspaceContainer.style.cursor = 'grabbing';
      this.grabbing = true;
    }

    if (pointConnection) {
      this.isMovableShape = false;

      const nextPoint = new AnchorPoint(this.ctx, { x: pointConnection.x, y: pointConnection.y });
      const directionalLink = this.diagram.nodeFactory.getLink([pointConnection, nextPoint]);
      this.anchorPoint = nextPoint;
      this.anchorPointLink = directionalLink;

      this.store.dispatch(ACTION.SET_NEW_CONNECTOR, directionalLink);
    }
  };

  private selectIndicator = (indicator: Indicator | null | undefined) => this.store.dispatch(ACTION.SET_INDICATOR, indicator);

  private selectNode = (node: Node | null | undefined) => this.store.dispatch(ACTION.SET_NODE, node);

  private selectLink = (link: Link | null | undefined) => this.store.dispatch(ACTION.SET_CONNECTOR, link);

  private onMouseUp = (e: MouseEvent) => {
    this.isMovableShape = false;

    if (this.moveAction) {
      this.store.archiveAction(this.moveAction);
      this.moveAction = null;
    }

    if (this.anchorPoint && this.anchorPointLink) {
      this.anchorPointLink.movePointFinished(this.anchorPoint);
      this.anchorPoint = null;
      this.anchorPointLink = null;
    }

    if (this.grabbing) {
      this.workspaceContainer.style.cursor = 'default';
      this.grabbing = false;
    }

    if (this.store.newConnector) {
      const cursorCoordinates = this.getCursorCoordinates(e);
      this.createConnection(cursorCoordinates, this.store.newConnector);
    }

    if (this.store.grid.snap) {
      this.setRelevantGridCoordinates();
    }
    this.store.dispatch(ACTION.SET_CONNECTION_POINT, null);
  };

  private createConnection = ({ x, y }: CoordinatePoint, newConnection: Link) => {
    const connectedNode = this.store.findNodeByCoordinates(x, y);
    let connectedPoint;
    if (connectedNode) {
      connectedPoint = connectedNode.getConnectionPoint({ x, y });
    }

    if (connectedPoint && (connectedPoint.x !== newConnection.points[0].x || connectedPoint.y !== newConnection.points[0].y)) {
      const createdConnector = this.diagram.nodeFactory.getLink([newConnection.points[0], connectedPoint]);

      this.store.dispatch(ACTION.ADD_CONNECTOR, createdConnector);
    }
    this.store.dispatch(ACTION.SET_NEW_CONNECTOR, null);
  };

  private setRelevantGridCoordinates = () => {
    if (this.store.selectedConnectionPoint) {
      const relevantCoordinates = this.getRelevantCoordinates(this.store.selectedConnectionPoint.x, this.store.selectedConnectionPoint.y);

      this.store.selectedConnectionPoint.move(relevantCoordinates.x, relevantCoordinates.y);
    }

    if (this.store.selectedNode) {
      const relevantCoordinates = this.getRelevantCoordinates(this.store.selectedNode.x, this.store.selectedNode.y);

      this.store.selectedNode.move(relevantCoordinates.x, relevantCoordinates.y);
    }
  };

  private getRelevantCoordinates = (x: number, y: number) => {
    const deltaPointX = x%GRID_STEP;
    const deltaPointY = y%GRID_STEP;

    const relevantX = (deltaPointX > GRID_STEP/2) ? (GRID_STEP - deltaPointX) : -deltaPointX;
    const relevantY = (deltaPointY > GRID_STEP/2) ? (GRID_STEP - deltaPointY) : -deltaPointY;

    return { x: relevantX, y: relevantY };
  };

  private onMouseClick = (e: MouseEvent) => {
    const cursorCoordinates = this.getCursorCoordinates(e);

    const detectedIndicator = this.getDetectedShapeSetNoActive(this.store.indicators, cursorCoordinates);
    const detectedNode = this.getDetectedShapeSetNoActive(this.store.nodes, cursorCoordinates);
    const detectedLine = this.getDetectedShapeSetNoActive(this.store.links, cursorCoordinates);

    this.selectIndicator(detectedIndicator);
    this.selectNode(detectedNode);
    this.selectLink(detectedLine);

    if (detectedIndicator) {
      detectedIndicator.isActive = true;
    } else if (detectedNode) {
      detectedNode.isActive = true;
    } else if (detectedLine) {
      detectedLine.isActive = true;
    }

    this.editedShape = detectedIndicator || detectedNode || null;
  };

  private onMouseDbClick = (e: MouseEvent) => {
    const cursorCoordinates = this.getCursorCoordinates(e);

    const detectedIndicator = this.getDetectedShapeSetNoActive(this.store.indicators, cursorCoordinates);
    if (detectedIndicator) {
      this.store.dispatch(ACTION.SET_INDICATOR_EDIT, { id: detectedIndicator.id, isEditing: true });
      return;
    }

    const detectedNode = this.getDetectedShapeSetNoActive(this.store.nodes, cursorCoordinates);
    if (detectedNode) {
      this.store.dispatch(ACTION.SET_NODE_EDIT, { id: detectedNode.id, isEditing: true });
    }
  };

  private getDetectedShapeSetNoActive<T extends Indicator | Link | Node>(shapes: T[], { x, y }: CoordinatePoint) {
    let detectedShape: T | undefined;

    shapes.forEach((it) => {
      it.isActive = false;

      const isIndicatorShape = it instanceof Indicator && it.includes(x, y);
      const isLinkShape = it instanceof Link && it.includes(x, y);
      const isNodeShape = it instanceof Node && it.includes(x, y);
      if (isIndicatorShape || isLinkShape || isNodeShape) {
        detectedShape = it;
      }
    });

    return detectedShape ? detectedShape : null;
  }

  private onDragover = (e: DragEvent) => e.preventDefault();
  private onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      const nodeType = e.dataTransfer.getData('node');
      const nodeParams = { x: e.offsetX, y: e.offsetY };
      const node = this.diagram.nodeFactory.getNode(nodeType, nodeParams);
      if (node) {
        this.store.dispatch(ACTION.ADD_NODE, node);
      }

      const isIndicator = e.dataTransfer.getData('indicator');
      if (isIndicator) {
        const canvas = this.ctx.canvas;
        const tmpHookDiv = document.createElement('div');
        const indicator = new Indicator(canvas, tmpHookDiv, { x: e.offsetX, y: e.offsetY, radius: 20 });

        this.store.dispatch(ACTION.ADD_INDICATOR, indicator);
      }
    }
  };
}
