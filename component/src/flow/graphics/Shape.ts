export default interface Shape {
  isActive: boolean;
  isHover: boolean;

  draw(): void;

  includes(x: number, y: number): boolean;

  move(dx: number, dy: number): void;
}
