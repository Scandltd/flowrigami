import DirectionalLink from '@app/_redesign/graphics/diagram/common/DirectionalLink';
import Node from '@app/_redesign/graphics/diagram/Node';
import Storage, { ACTION } from '@app/_redesign/storage/Storage';
import { GRID_STEP } from '@app/flow/DefaultThemeConstants';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Shape from '@app/flow/graphics/Shape';


function getSnappedValue(delta: number) {
  return delta - (delta%GRID_STEP);
}

export default class CanvasEventListener {
  private canvas: HTMLElement;
  private storage: Storage;


  private movingShape: Shape | undefined;
  private drawingLineStartPoint: CoordinatePoint | undefined;

  private dx = 0;
  private dy = 0;

  constructor(canvas: HTMLElement, storage: Storage) {
    this.canvas = canvas;
    this.storage = storage;

    this.addEventListeners();
  }

  public unmount() {
    this.removeEventListeners();
  }

  private addEventListeners = () => {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('mouseleave', this.onMouseUp);
    this.canvas.addEventListener('click', this.onMouseClick);

    this.canvas.addEventListener('dragover', this.onDragover);
    this.canvas.addEventListener('drop', this.onDrop);
  };

  private removeEventListeners = () => {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mouseleave', this.onMouseUp);
    this.canvas.removeEventListener('click', this.onMouseClick);

    this.canvas.removeEventListener('dragover', this.onDragover);
    this.canvas.removeEventListener('drop', this.onDrop);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.movingShape) {
      this.handleMoveShape(e);
      return;
    }

    if (this.drawingLineStartPoint) {
      this.handleDrawingLine(e);
      return;
    }

    this.handleHoverShape(e);
  };

  private handleMoveShape = (e: MouseEvent) => {
    if (!this.movingShape) return;

    const scale = this.storage.scale;
    this.dx += e.movementX/scale;
    this.dy += e.movementY/scale;

    const isSnapToGrid = this.storage.grid.snap;
    const moveX = isSnapToGrid ? getSnappedValue(this.dx) : this.dx;
    const moveY = isSnapToGrid ? getSnappedValue(this.dy) : this.dy;
    if (moveX !== 0 || moveY !== 0) {
      this.dx -= moveX;
      this.dy -= moveY;

      this.storage.dispatch(ACTION.SHAPE_MOVING, {
        shape: this.movingShape,
        moveX,
        moveY,
      });
    }
  };

  private handleDrawingLine = (e: MouseEvent) => {
    if (!this.drawingLineStartPoint) return;

    this.storage.dispatch(ACTION.LINK_DRAWING, {
      from: this.drawingLineStartPoint,
      to: { x: e.offsetX, y: e.offsetY },
    });

    const params = {
      from: this.drawingLineStartPoint,
      to: { x: e.offsetX, y: e.offsetY },
    };

    // @TODO - this is tmp fix, must be removed in future
    const canvas = this.canvas.querySelector('canvas') as HTMLCanvasElement;
    this.storage.dispatch(ACTION.LINK_DRAWING, new DirectionalLink(canvas, document.createElement('div'), params));
  };

  private handleHoverShape = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const hoveredShape = this.storage.findShape(x, y);
    this.storage.dispatch(ACTION.HOVER, hoveredShape);

    this.canvas.style.cursor = hoveredShape ? 'pointer' : 'default';
  };

  private onMouseDown = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;

    this.movingShape = this.storage.findShape(x, y);
    if (this.movingShape instanceof Node) {
      const connectionPoint = this.movingShape.findConnectionPoint(x, y);
      if (connectionPoint) {
        this.movingShape = undefined;
        this.drawingLineStartPoint = { x: connectionPoint.x, y: connectionPoint.y };
      }
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (this.movingShape) {
      this.movingShape = undefined;
      this.storage.dispatch(ACTION.SHAPE_MOVE_END, this.movingShape);
    }

    if (this.drawingLineStartPoint) {
      this.drawingLineStartPoint = undefined;
      this.storage.dispatch(ACTION.LINK_DRAWING_END);
    }
  };

  private onMouseClick = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const activeShape = this.storage.findShape(x, y);
    this.storage.dispatch(ACTION.ACTIVATE, activeShape);
  };

  private onDragover = (e: DragEvent) => e.preventDefault();
  private onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      const x = e.offsetX;
      const y = e.offsetY;

      const nodeName = e.dataTransfer.getData('node');
      // @TODO 1) create shape with node
      // @TODO 2) import by dropping json on canvas
      alert('unfortunately it\'s not implemented yet =)');
    }
  };
}
