import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Shape from '@app/flow/graphics/Shape';


interface GridOptions {
  enabled: boolean;
  snap: boolean;
}

interface LineDrawing {
  from: CoordinatePoint;
  to: CoordinatePoint;
}

interface ShapeMove {
  shape: Shape;
  moveX: number;
  moveY: number;
}

export enum ACTION {
  HOVER,
  ACTIVATE,

  LINK_DRAWING,
  LINK_DRAWING_END,

  SHAPE_MOVING,
  SHAPE_MOVE_END,
}

export default class Storage {
  private _scale = 1;
  private _grid: GridOptions = {
    enabled: true,
    snap: true,
  };
  private _links: Shape[] = [];
  private _nodes: Shape[] = [];
  private _drawingLink: Shape | undefined;


  public get scale(): number {
    return this._scale;
  }

  public get grid(): GridOptions {
    return this._grid;
  }

  public get links(): Shape[] {
    return this._links;
  }

  public get nodes(): Shape[] {
    return this._nodes;
  }

  public get shapes(): Shape[] {
    const shapes: Shape[] = [];

    shapes.push(...this.nodes.filter((it) => (!it.isHover && !it.isActive)));
    shapes.push(...this.links);
    shapes.push(...this.nodes.filter((it) => (it.isHover || it.isActive)));

    if (this._drawingLink) {
      shapes.push(this._drawingLink);
    }

    return shapes;
  }

  public findShape(x: number, y: number) {
    let shape = findShapeReversed(this.nodes, x, y);
    if (!shape) {
      shape = findShapeReversed(this.links, x, y);
    }
    return shape;
  }

  public dispatch(action: ACTION, payload?: any) {
    switch (action) {
      case ACTION.HOVER: {
        handleHover(this.shapes, payload);
        break;
      }
      case ACTION.ACTIVATE: {
        handleActivate(this.shapes, payload);
        break;
      }
      case ACTION.LINK_DRAWING: {
        this._drawingLink = payload;
        break;
      }
      case ACTION.LINK_DRAWING_END: {
        this._drawingLink = undefined;
        break;
      }
      case ACTION.SHAPE_MOVING: {
        handleMoveShape(payload);
        break;
      }
      case ACTION.SHAPE_MOVE_END: {
        handleMoveShapeEnd(payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}


function findShapeReversed(shapes: Shape[], x: number, y: number) {
  return [...shapes].reverse().find((it) => it.includes(x, y));
}

function handleHover(shapes: Shape[], hovered: Shape | undefined) {
  if (hovered?.isHover) return;

  shapes.forEach((it) => {
    it.isHover = it.id === hovered?.id;
  });
}

function handleActivate(shapes: Shape[], active: Shape | undefined) {
  if (active?.isActive) return;

  shapes.forEach((it) => {
    it.isActive = it.id === active?.id;
  });
}


function handleMoveShape({ shape, moveX, moveY}: ShapeMove) {
  if (!shape.isMoving) {
    shape.isMoving = true;
  }
  shape.move(moveX, moveY);
}

function handleMoveShapeEnd(shape: Shape) {
  shape.isMoving = false;
}
