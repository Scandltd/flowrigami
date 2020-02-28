import { GRID_STEP } from '@app/flow/DefaultThemeConstants';
import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Diagram from '@app/flow/diagram/Diagram';
import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
import NodeShape from '@app/flow/diagram/NodeShape';
import DirectionalLink from '@app/flow/diagram/uml/link/DirectionalLink';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import { chartBorderDefinition } from '@app/flow/layout/workspace/Canvas';
import ACTION from '@app/flow/store/ActionTypes';
import MoveInstance from '@app/flow/store/history/impl/MoveInstance';
import Store from '@app/flow/store/Store';


export default class CanvasEventListener {
  private canvasContainer: HTMLElement;
  private ctx: CanvasRenderingContext2D;
  private store: Store;
  private diagram: Diagram;

  private grabbing = false;
  private isMovableShape = true;
  private moveAction: MoveInstance | null = null;
  private editedShape: Indicator | NodeShape | null = null;

  private anchorPoint: AnchorPoint | null | undefined = null;
  private anchorPointLink: Link | null | undefined = null;


  constructor(canvasContainer: HTMLElement, ctx: CanvasRenderingContext2D, store: Store, diagram: Diagram) {
    this.canvasContainer = canvasContainer;
    this.ctx = ctx;
    this.store = store;
    this.diagram = diagram;

    this.addEventListeners();
  }

  public unmount() {
    this.removeEventListeners();
  }

  private addEventListeners = () => {
    this.canvasContainer.addEventListener('mousemove', this.onMouseMove);
    this.canvasContainer.addEventListener('mousedown', this.onMouseDown);
    this.canvasContainer.addEventListener('mouseup', this.onMouseUp);
    this.canvasContainer.addEventListener('mouseleave', this.onMouseUp);
    this.canvasContainer.addEventListener('click', this.onMouseClick);
    this.canvasContainer.addEventListener('dblclick', this.onMouseDbClick);

    this.canvasContainer.addEventListener('dragover', this.onDragover);
    this.canvasContainer.addEventListener('drop', this.onDrop);
  };

  private removeEventListeners = () => {
    this.canvasContainer.removeEventListener('mousemove', this.onMouseMove);
    this.canvasContainer.removeEventListener('mousedown', this.onMouseDown);
    this.canvasContainer.removeEventListener('mouseup', this.onMouseUp);
    this.canvasContainer.removeEventListener('mouseleave', this.onMouseUp);
    this.canvasContainer.removeEventListener('click', this.onMouseClick);
    this.canvasContainer.removeEventListener('dblclick', this.onMouseDbClick);

    this.canvasContainer.removeEventListener('dragover', this.onDragover);
    this.canvasContainer.removeEventListener('drop', this.onDrop);
  };

  private onMouseMove = (e: MouseEvent) => {
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

    if (this.grabbing) {
      const top = this.canvasContainer.style.top ? parseInt(this.canvasContainer.style.top, 10) : 0;
      const left = this.canvasContainer.style.left ? parseInt(this.canvasContainer.style.left, 10) : 0;

      this.canvasContainer.style.top = `${top + e.movementY}px`;
      this.canvasContainer.style.left = `${left + e.movementX}px`;
    }

    if (this.store.selectedNode || this.store.selectedConnector) {
      this.resizeWorkspace();
    }
  };

  private onHoverDetection = (e: MouseEvent) => {
    const cursorCoordinates = this.getCursorCoordinates(e);

    this.store.indicators.forEach((it) => {
      const isMouseIn = it.includes(cursorCoordinates.x, cursorCoordinates.y);
      if (!it.isActive) {it.isHover = isMouseIn;}
    });
    this.store.nodeList.forEach((it) => {
      const isMouseIn = it.includes(cursorCoordinates.x, cursorCoordinates.y);
      if (!it.isActive) {it.isHover = isMouseIn;}
    });
    this.store.connectorList.forEach(link => link.onHover(link.includes(cursorCoordinates)));
  };

  private getCursorCoordinates = (e: MouseEvent) => new Coordinates(e.offsetX, e.offsetY);

  private handleCursorMutation = (e: MouseEvent) => {
    if (!this.grabbing) {
      const coordinates = this.getCursorCoordinates(e);

      const hoveredIndicator = this.store.indicators.find((it) => it.includes(coordinates.x, coordinates.y));
      const hoveredShape = this.store.nodeList.find((node) => node.includes(coordinates.x, coordinates.y));
      const hoveredLine = this.store.connectorList.find((link) => link.includes(coordinates));
      if (hoveredIndicator || hoveredShape || hoveredLine) {
        this.canvasContainer.style.cursor = 'pointer';
        if (hoveredShape && hoveredShape.getConnectionPoint(coordinates)) {
          this.canvasContainer.style.cursor = 'crosshair';
        }
      } else {
        this.canvasContainer.style.cursor = 'default';
      }
    }
  };

  private resizeWorkspace = () => {
    const { min, max } = chartBorderDefinition(this.store.nodeList, this.store.connectorList);

    // needs for fixing offset canvas when scale < 1
    const scaleOffset = (1 - this.store.scale)*100;
    const canvasAreaIncrement = GRID_STEP*20;
    const detectionBorder = GRID_STEP*5;

    let isWorkspaceResized = false;
    let offsetX = 0;
    let offsetY = 0;

    const realCanvas = this.ctx.canvas;
    if (min.x < detectionBorder) {
      const left = this.canvasContainer.style.left ? parseInt(this.canvasContainer.style.left, 10) : 0;

      this.canvasContainer.style.left = `${left - canvasAreaIncrement + scaleOffset}px`;
      realCanvas.width += canvasAreaIncrement;
      offsetX = canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (min.y < detectionBorder) {
      const top = this.canvasContainer.style.top ? parseInt(this.canvasContainer.style.top, 10) : 0;

      this.canvasContainer.style.top = `${top - canvasAreaIncrement + scaleOffset}px`;
      realCanvas.height += canvasAreaIncrement;
      offsetY = canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (max.x + detectionBorder > realCanvas.width) {
      const left = this.canvasContainer.style.left ? parseInt(this.canvasContainer.style.left, 10) : 0;

      this.canvasContainer.style.left = `${left - scaleOffset}px`;
      realCanvas.width += canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (max.y + detectionBorder > realCanvas.height) {
      const top = this.canvasContainer.style.top ? parseInt(this.canvasContainer.style.top, 10) : 0;

      this.canvasContainer.style.top = `${top - scaleOffset}px`;
      realCanvas.height += canvasAreaIncrement;
      isWorkspaceResized = true;
    }

    if (isWorkspaceResized) {
      this.store.nodeList.forEach((node) => node.move(offsetX, offsetY));
      this.store.connectorList.forEach((link) => link.move(offsetX, offsetY));
    }
  };

  private onMouseDown = (e: MouseEvent) => {
    this.isMovableShape = true;

    const cursorCoordinates = this.getCursorCoordinates(e);
    this.selectIndicator(this.store.indicators.find((it) => it.includes(cursorCoordinates.x, cursorCoordinates.y)));
    this.selectNode(this.store.nodeList.find((node) => node.includes(cursorCoordinates.x, cursorCoordinates.y)));
    this.selectLink(this.store.connectorList.find((link) => link.includes(cursorCoordinates)));

    let pointConnection;
    if (this.store.selectedIndicator) {
      // ignore
    } else if (this.store.selectedNode) {
      pointConnection = this.store.selectedNode.getConnectionPoint(cursorCoordinates);
    } else if (this.store.selectedConnector) {

      const detectedPoint = this.store.selectedConnector.getDetectedPoint(cursorCoordinates);
      if (detectedPoint) {
        this.anchorPoint = detectedPoint;
        this.anchorPointLink = this.store.selectedConnector;
      }

      this.store.dispatch(ACTION.SET_CONNECTION_POINT, detectedPoint);
    } else {
      this.canvasContainer.style.cursor = 'grabbing';
      this.grabbing = true;
    }

    if (pointConnection) {
      this.isMovableShape = false;

      const nextPoint = new AnchorPoint(this.ctx, { x: pointConnection.x, y: pointConnection.y });
      const directionalLink = new DirectionalLink(this.ctx, [pointConnection, nextPoint]);
      this.anchorPoint = nextPoint;
      this.anchorPointLink = directionalLink;

      this.store.dispatch(ACTION.SET_NEW_CONNECTOR, directionalLink);
    }
  };

  private selectIndicator = (indicator: Indicator | null | undefined) => this.store.dispatch(ACTION.SET_INDICATOR, indicator);

  private selectNode = (node: NodeShape | null | undefined) => this.store.dispatch(ACTION.SET_NODE, node);

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
      this.canvasContainer.style.cursor = 'default';
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

  private createConnection = (cursorCoordinates: Coordinates, newConnection: Link) => {
    const connectedShape = this.store.nodeList.find((node) => node.includes(cursorCoordinates.x, cursorCoordinates.y));
    let connectedPoint;
    if (connectedShape) {
      connectedPoint = connectedShape.getConnectionPoint(cursorCoordinates);
    }

    if (connectedPoint && (connectedPoint.x !== newConnection.points[0].x || connectedPoint.y !== newConnection.points[0].y)) {
      const createdConnector = new DirectionalLink(this.ctx, [newConnection.points[0], connectedPoint]);
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

    const detectedIndicator = this.getDetectedIndicatorSetNoActive(this.store.indicators, cursorCoordinates);
    const detectedNode = this.getDetectedShapeSetNoActive(this.store.nodeList, cursorCoordinates);
    const detectedLine = this.getDetectedShapeSetNoActive(this.store.connectorList, cursorCoordinates);

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

    const detectedIndicator = this.getDetectedIndicatorSetNoActive(this.store.indicators, cursorCoordinates);
    if (detectedIndicator) {
      this.store.dispatch(ACTION.SET_INDICATOR_EDIT, { id: detectedIndicator.id, isEditing: true });
      return;
    }

    const detectedNode = this.getDetectedShapeSetNoActive(this.store.nodeList, cursorCoordinates);
    if (detectedNode) {
      this.store.dispatch(ACTION.SET_NODE_EDIT, { id: detectedNode.id, isEditing: true });
    }
  };

  private getDetectedShapeSetNoActive<T extends NodeShape | Link>(shapes: T[], coordinates: Coordinates) {
    let detectedShape: T | undefined;

    shapes.forEach((it) => {
      it.isActive = false;

      const isNodeShape = it instanceof NodeShape && it.includes(coordinates.x, coordinates.y);
      const isLinkShape = it instanceof Link && it.includes(coordinates);
      if (isNodeShape || isLinkShape) {
        detectedShape = it;
      }
    });

    return detectedShape ? detectedShape : null;
  }

  private getDetectedIndicatorSetNoActive(shapes: Indicator[], { x, y }: Coordinates) {
    let detectedShape: Indicator | undefined;

    shapes.forEach((it) => {
      it.isActive = false;
      if (it.includes(x, y)) {
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
