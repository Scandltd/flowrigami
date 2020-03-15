export default class Coordinates {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  };

  public get y() {
    return this._y;
  };

  public move(dx: number, dy: number) {
    this._x += dx;
    this._y += dy;
  };

  public clone() {
    return new Coordinates(this._x, this._y);
  };
}
