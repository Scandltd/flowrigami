import Action from '@app/flow/store/history/Action';


export default class MoveShape implements Action {
  movableInstance: any;
  dx: number = 0;
  dy: number = 0;

  constructor(movableInstance: any) {
    this.movableInstance = movableInstance;
  }

  pushCoordinates = (dx: number, dy: number) => {
    this.dx = this.dx + dx;
    this.dy = this.dy + dy;
  };

  public redo = () => {
    this.movableInstance.move(this.dx, this.dy);
  };

  public undo = () => {
    this.movableInstance.move(-this.dx, -this.dy);
  };
}
