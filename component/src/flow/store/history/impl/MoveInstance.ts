import Action from '@app/flow/store/history/Action';


export default class MoveInstance implements Action {
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

  execute = () => {
    this.movableInstance.move(this.dx, this.dy);
  };

  revert = () => {
    this.movableInstance.move(-this.dx, -this.dy);
  };
}
